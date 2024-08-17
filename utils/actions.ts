"use server";

import prisma from "./db";
import { redirect } from "next/navigation";
import { ActionFunction } from "./types";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateZodSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";
import { type Cart } from "@prisma/client";

// UTILITIES
const includeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_ID) redirect("/");
  return user;
};

const fetchProduct = async (productId: string) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateOrCreateCartItem = async (
  productId: string,
  cartId: string,
  amount: number
) => {
  let cartItem = await prisma.cartItem.findFirst({
    where: {
      productId,
      cartId,
    },
  });

  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        amount,
        productId,
        cartId,
      },
    });
  }
};

// USER FUNCTIONS

export const fetchFeaturedProducts = async () => {
  const products = await prisma.products.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = async ({ search = "" }: { search: string }) => {
  const products = await prisma.products.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await prisma.products.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    redirect("/");
  }

  return product;
};

export const fetchFavoriteId = async (productId: string) => {
  const user = await getAuthUser();

  const favorite = await prisma.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction: ActionFunction = async (
  prevState,
  formData
) => {
  const user = await getAuthUser();
  const prevStateTyped = prevState as {
    productId: string;
    favoriteId: string | null;
    pathname: string;
  };
  const { productId, favoriteId, pathname } = prevStateTyped;

  try {
    if (favoriteId) {
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return {
      message: favoriteId ? "Removed from favorites" : "Added to favorites",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFavorites = async () => {
  const user = await getAuthUser();

  const favorites = await prisma.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });
  return favorites;
};

export const createReviewAction: ActionFunction = async (
  prevState,
  formData
) => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const validated = validateZodSchema(reviewSchema, rawData);

    await prisma.review.create({
      data: {
        ...validated,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${validated.productId}`);
    revalidatePath("/reviews")
    return { message: "Review added successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId: productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await prisma.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
  return reviews;
};

export const deleteReviewAction: ActionFunction = async (
  prevState,
  formData
) => {
  const { reviewId } = prevState as { reviewId: string };
  const user = await getAuthUser();

  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });

    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const findExistingReview = async (userId: string, productId: string) => {
  return prisma.review.findFirst({
    where: {
      productId,
      clerkId: userId,
    },
  });
};

export const fetchProductRating = async (productId: string) => {
  const result = await prisma.review.groupBy({
    by: ["productId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      productId,
    },
  });
  return {
    avgRating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    countRating: result[0]?._count.rating ?? 0,
  };
};

export const fetchCartItems = async () => {
  const { userId } = auth();

  const cart = await prisma.cart.findFirst({
    where: {
      clerkId: userId ?? "",
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0;
};

export const fetchOrCreateCart = async (
  userId: string,
  errorOnFailure: boolean = false
) => {
  let cart = await prisma.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeProductClause,
  });
  if (!cart && errorOnFailure) {
    throw new Error("Cart not found");
  }

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        clerkId: userId,
      },
      include: includeProductClause,
    });
  }
  return cart;
};

export const updateCart = async (cart: Cart) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }

  const tax = 0.1 * cartTotal;  
  
  const shipping = cartTotal ? cart.shipping : 0;
  const orderTotal = cartTotal + tax + shipping;

  const currentCart = await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
  });
  return { cartItems, currentCart };
};

export const addToCartAction: ActionFunction = async (prevState, formData) => {
  const user = await getAuthUser();

  try {
    const productId = formData.get("productId") as string;
    const amount = Number(formData.get("amount"));

    await fetchProduct(productId);
    const cart = await fetchOrCreateCart(user.id);
    
    await updateOrCreateCartItem(productId, cart.id, amount);
    
    await updateCart(cart);
    revalidatePath("/cart")
    return { message: "Cart updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const removeCartItemAction: ActionFunction = async (
  prevState,
  formData
) => {
  const user = await getAuthUser();

  try {
    const cartItemId = formData.get("id") as string;
    const cart = await fetchOrCreateCart(user.id, true);

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    await updateCart(cart);
    revalidatePath("/cart");

    return { message: "Item removed from cart" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateCartItemAction = async (
  amount: number,
  cartItemId: string
) => {
  const user = await getAuthUser();

  try {
    const cart = await fetchOrCreateCart(user.id, true);

    await prisma.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: { amount },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "Cart updated" };
  } catch (error) {
    return renderError(error);
  }
};

export const createOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  let orderId: null | string = null;
  let cartId: null | string = null;
  try {
    const cart = await fetchOrCreateCart(
      user.id,
      true,
    );
    cartId = cart.id;
    await prisma.order.deleteMany({
      where: {
        clerkId: user.id,
        isPaid: false,
      },
    });

    const order = await prisma.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    orderId = order.id;
  } catch (error) {
    return renderError(error);
  }
  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};

export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = prisma.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return orders
}

// ADMIN FUNCTIONS

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await prisma.products.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
};

export const createProductAction: ActionFunction = async (
  prevState,
  formData
) => {
  const user = await getAdminUser();

  try {
    const rawData = Object.fromEntries(formData);
    const image = formData.get("image") as File;

    const validated = validateZodSchema(productSchema, rawData);
    const validatedImage = validateZodSchema(imageSchema, { image });

    console.log(validatedImage);

    await prisma.products.create({
      data: {
        ...validated,
        image: "/images/product-1.jpg",
        clerkId: user.id,
      },
    });
    return { message: "product created" };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;

  try {
    await prisma.products.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath("/admin/products");
    return { message: "product removed" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await prisma.products.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) redirect("/admin/products");
  return product;
};

export const updateProductAction: ActionFunction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const id = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validated = validateZodSchema(productSchema, rawData);

    await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        ...validated,
      },
    });
    revalidatePath(`/admin/products/${id}/edit`);
    return { message: "product updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction: ActionFunction = async (
  prevState,
  formData
) => {
  return { message: "Product image updated successfully" };
};

export const fetchAdminOrders = async () => {
  await getAdminUser();

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return orders
}
