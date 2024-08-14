import { NextResponse } from "next/server";
import prisma from "./db";
import { redirect } from "next/navigation";
import { ActionFunction } from "./types";
import { currentUser } from "@clerk/nextjs/server";
import { imageSchema, productSchema, validateZodSchema } from "./schemas";
import { revalidatePath } from "next/cache";

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

export const fetchAdminProducts = async () => {
  const { id } = await getAuthUser();
  const products = await prisma.products.findMany({
    where: {
      clerkId: id,
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

export const createProductAction: ActionFunction = async (
  prevState,
  formData
) => {
  "use server";
  const user = await getAuthUser();

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
  "use server"
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
