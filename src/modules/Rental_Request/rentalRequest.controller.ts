import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalRequestService } from "./rentalRequest.service";



const createRentalRequest = catchAsync(async (req: Request, res: Response) => {

  const tenantId = req.user?.id as string;

  const payload = req.body;

  const rentalRequest =
    await rentalRequestService.createRentalRequestIntoDB(
      payload,
      tenantId
    );


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request created successfully",
    data: {
      rentalRequest,
    },
  });

});



const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {

  const tenantId = req.user?.id as string;

  const rentalRequests =
    await rentalRequestService.getMyRentalRequestsFromDB(
      tenantId
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests fetched successfully",
    data: {
      rentalRequests,
    },
  });

});



const getSingleRentalRequest = catchAsync(

  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("Rental Request Id is required in params");
    }

    const tenantId = req.user?.id as string;

    const rentalRequest =
      await rentalRequestService.getSingleRentalRequestFromDB(
        id as string,
        tenantId
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request fetched successfully",
      data: {
        rentalRequest,
      },
    });

  }
);



const getLandlordRentalRequests = catchAsync(

  async (req: Request, res: Response) => {

    const landlordId = req.user?.id as string;

    const rentalRequests =
      await rentalRequestService.getLandlordRentalRequestsFromDB(
        landlordId
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests fetched successfully",
      data: {
        rentalRequests,
      },
    });

  }
);



const updateRentalRequestStatus = catchAsync(

  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("Rental Request Id is required in params");
    }

    const landlordId = req.user?.id as string;
    const payload = req.body;

    const updatedRentalRequest =
      await rentalRequestService.updateRentalRequestStatusIntoDB(
        id as string,
        payload,
        landlordId
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request updated successfully",
      data: {
        updatedRentalRequest,
      },
    });

  }
);



export const rentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};