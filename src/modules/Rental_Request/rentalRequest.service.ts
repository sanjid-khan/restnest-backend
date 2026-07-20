import { PropertyStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  CreateRentalRequestPayload,
  UpdateRentalRequestPayload,
} from "./rentalRequest.interface";



const createRentalRequestIntoDB = async ( payload: CreateRentalRequestPayload,tenantId: string) => {
  
  await prisma.user.findUniqueOrThrow({
    where: {
      id: tenantId,
    },
  });

  
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: payload.propertyId,
    },
  });

  
  if (property.status !== PropertyStatus.AVAILABLE) {
    throw new Error("Property is not available.");
  }

  
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: RentalRequestStatus.PENDING,
    },
  });


  if (existingRequest) {
    throw new Error("You have already submitted a rental request for this property.");
  }


  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      moveInDate: new Date(payload.moveInDate), 
      message: payload.message,
      tenantId,
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

  return rentalRequest;


};




const getMyRentalRequestsFromDB = async (tenantId: string) => {

  await prisma.user.findUniqueOrThrow({
    where: {
      id: tenantId,
    },
  });


  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },

    include: {
      property: {
        include: {
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;

};



const getSingleRentalRequestFromDB = async ( id: string,tenantId: string) => {

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      property: {
        include: {
          category: true,
          landlord: {
            omit: {
              password: true,
            },
          },
        },
      },
      payments: true,
      review: true,
    },
  });


  if (rentalRequest.tenantId !== tenantId) {
    throw new Error("You are not authorized to view this rental request.");
  }

  return rentalRequest;

};




const getLandlordRentalRequestsFromDB = async (landlordId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: landlordId,
    },
  });

  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      property: {
        include: {
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;

};



const updateRentalRequestStatusIntoDB = async (id: string,payload: UpdateRentalRequestPayload,landlordId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      property: true,
    },
  });

  
  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error("You are not the owner of this property.");
  }

  
  if (rentalRequest.status !== RentalRequestStatus.PENDING) {
    throw new Error("This rental request has already been processed.");
  }

  const result = await prisma.$transaction(async (tx) => {

    const updatedRentalRequest = await tx.rentalRequest.update({
      where: {
        id,
      },
      data: {
        status: payload.status,
      },
      include: {
        tenant: {
          omit: {
            password: true,
          },
        },
        property: {
          include: {
            category: true,
          },
        },
      },
    });


    if (payload.status === RentalRequestStatus.APPROVED) {
      await tx.property.update({
        where: {
          id: rentalRequest.propertyId,
        },
        data: {
          status: PropertyStatus.RENTED,
        },
      });


      await tx.rentalRequest.updateMany({
        where: {
          propertyId: rentalRequest.propertyId,
          status: RentalRequestStatus.PENDING,
          NOT: {
            id: rentalRequest.id,
          },
        },
        data: {
          status: RentalRequestStatus.REJECTED,
        },
      });
    }

    return updatedRentalRequest;

  });

  return result;

  
};

export const rentalRequestService = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getSingleRentalRequestFromDB,
  getLandlordRentalRequestsFromDB,
  updateRentalRequestStatusIntoDB,
};


