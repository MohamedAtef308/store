"use server";

import prisma from "./db";
import { redirect } from "next/navigation";
import { ActionFunction } from "./types";
import { currentUser } from "@clerk/nextjs/server";
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateZodSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

// UTILITY FUNCTIONS

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

export const deleteReviewAction:ActionFunction = async (prevState, formData) => {
  const {reviewId} = prevState as {reviewId: string}
  const user = await getAuthUser();
  
  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id
      }
    })  

    revalidatePath("/reviews")
    return {message: "Review deleted successfully"}
  } catch (error) {
    return renderError(error);
  }
};

export const findExistingReview = async (userId: string, productId: string) => {
  return prisma.review.findFirst({
    where: {
      productId,
      clerkId: userId
    }
  })
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
