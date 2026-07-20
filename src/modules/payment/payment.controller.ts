import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";


const createPaymentSession = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;

    const { rentalRequestId } = req.body;

    const result = await paymentServices.createPaymentSession(
      tenantId as string,
      rentalRequestId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully",
      data: result,
    });

  }
);

const handleWebhook = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentServices.handleWebhook(
      payload,
      signature as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook triggered successfully",
      data: null,
    });

  }
);

const getPaymentHistory = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;

    const result = await paymentServices.getPaymentHistory(
      tenantId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });

  }
);

const getSinglePayment = catchAsync(

  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.id;
    const tenantId = req.user?.id;

    const result = await paymentServices.getSinglePayment(
      paymentId as string,
      tenantId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });

  }
);



export const paymentController = {
  createPaymentSession,
  handleWebhook,
  getPaymentHistory,
  getSinglePayment,
};