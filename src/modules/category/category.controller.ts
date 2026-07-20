import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";


const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const category = await categoryService.createCategoryIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: { category },
  });

});


const getAllCategories = catchAsync(async (req: Request, res: Response) => {

  const categories = await categoryService.getAllCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: { categories },
  });

});


const getSingleCategory = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("Category id is required in params.");
  }

  const category = await categoryService.getSingleCategoryFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category fetched successfully",
    data: { category },
  });

});


const updateCategory = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("Category id is required in params.");
  }

  const payload = req.body;

  const updatedCategory = await categoryService.updateCategoryIntoDB(
    id as string,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: { updatedCategory },
  });
});


const deleteCategory = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("Category id is required in params.");
  }

  await categoryService.deleteCategoryFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: null,
  });
  
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};