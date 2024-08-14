import { NextResponse } from "next/server";
import prisma from "./db";
import { redirect } from "next/navigation";
import { ActionFunction } from "./types";
import { currentUser } from "@clerk/nextjs/server";
import { productSchema, validateZodSchema } from "./schemas";

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
    
    const validated = validateZodSchema(productSchema, rawData);

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
