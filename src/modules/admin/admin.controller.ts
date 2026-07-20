import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";
import { IPropertyQuery } from "../property/property.interface";

const getAllProperties = catchAsync(async (req: Request, res: Response) => {

  const query = req.query as IPropertyQuery;

  const result = await adminServices.getAllProperties(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });

});



const getAllUsers = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {

    const result = await adminServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result,
    });

  }
);



const updateUserStatus = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;

    const result = await adminServices.updateUserStatus(
      userId as string,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });

  }
);



const getAllRentalRequests = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {

    const result = await adminServices.getAllRentalRequests();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result,
    });

  }
);


export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};