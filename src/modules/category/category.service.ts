import { prisma } from "../../lib/prisma";
import { CreateCategoryPayload,UpdateCategoryPayload } from "./category.interface";



const createCategoryIntoDB = async (payload: CreateCategoryPayload) => {

  const { name, description } = payload;

  const isCategoryExist = await prisma.category.findUnique({
    where: {
      name,
    },
  });


  if (isCategoryExist) {
    throw new Error("Category already exists");
  }


  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return category;

};



const getAllCategoriesFromDB = async () => {

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;

};



const getSingleCategoryFromDB = async (categoryId: string) => {

  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  return category;

};



const updateCategoryIntoDB = async (categoryId: string, payload: UpdateCategoryPayload) => 
 {

  const { name, description } = payload;

  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  if (name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }
  }

  const updatedCategory = await prisma.category.update({

    where: {
      id: categoryId,
    },
    data: {
      name,
      description,
    },
  });


  return updatedCategory;

};



const deleteCategoryFromDB = async (categoryId: string) => {

  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
    include: {
      properties: true,
    },

  });

  if (category.properties.length > 0) {
    throw new Error(
      "This category cannot be deleted because it is assigned to one or more properties."
    );
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;

};



export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};