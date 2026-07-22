import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";
import { IPropertyQuery } from "./property.interface";


const createProperty = catchAsync(async (req: Request, res: Response) => {

  const landlordId = req.user?.id as string;

  const payload = req.body;

  const property = await propertyService.createPropertyIntoDB(
    payload,
    landlordId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: { property },
  });
});



const getAllProperties = catchAsync(async (req: Request, res: Response) => {

  const query = req.query as IPropertyQuery;

  const result = await propertyService.getAllPropertiesFromDB(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties fetched successfully",
    data: result.data,
    meta: result.meta,
  });

});



const getSingleProperty = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("Property Id is required in params");
  }

  const property = await propertyService.getSinglePropertyFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property fetched successfully",
    data: { property },
  });

});



const updateProperty = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("Property Id is required in params");
  }

  const landlordId = req.user?.id as string;
  const payload = req.body;

  const updatedProperty = await propertyService.updatePropertyIntoDB(
    id as string,
    payload,
    landlordId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: { updatedProperty },
  });

});



const deleteProperty = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("Property Id is required in params");
  }

  const landlordId = req.user?.id as string;

  await propertyService.deletePropertyFromDB(id as string, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null,
  });

});



export const propertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};