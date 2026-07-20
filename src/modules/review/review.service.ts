import { prisma } from "../../lib/prisma";
import { PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import { ICreateReview, IUpdateReview } from "./review.interface";


const createReview = async (tenantId: string,payload: ICreateReview) => {

  const { rentalRequestId, rating, comment } = payload;

  const rentalRequest = await prisma.rentalRequest.findFirstOrThrow({
    where: {
      id: rentalRequestId,
      tenantId,
      status: RentalRequestStatus.APPROVED,
    },
    include: {
      payments: true,
    },
  });


  const hasCompletedPayment = rentalRequest.payments.some(
  (pay) => pay.status === PaymentStatus.COMPLETED
  );


  if (!hasCompletedPayment) {
   throw new Error("Payment must be completed before submitting a review.");
  }


  const existingReview = await prisma.review.findUnique({
    where: {
      rentalRequestId,
    },
  });


  if (existingReview) {
    throw new Error("Review already exists for this rental request.");
  }


  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      tenantId,
      rentalRequestId,
      propertyId: rentalRequest.propertyId,
    },

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      property: true,
    },
  });

  return review;

};



const getPropertyReviews = async (propertyId: string) => {

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;

};



const updateReview = async (reviewId: string,tenantId: string,payload: IUpdateReview) => {

  await prisma.review.findFirstOrThrow({
    where: {
      id: reviewId,
      tenantId,
    },
  });


  const review = await prisma.review.update({
    where: {
      id: reviewId,
    },

    data: payload,

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      property: true,
    },
  });

  return review;


};



const deleteReview = async ( reviewId: string,tenantId: string) => {

  await prisma.review.findFirstOrThrow({
    where: {
      id: reviewId,
      tenantId,
    },
  });

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return null;

};



export const reviewServices = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};