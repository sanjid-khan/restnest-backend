import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from "./property.interface";

import { PropertyWhereInput } from "../../../generated/prisma/models";
import { PropertyType,PropertyStatus } from "../../../generated/prisma/enums";


const createPropertyIntoDB = async (payload: CreatePropertyPayload,landlordId: string) => {

  await prisma.user.findUniqueOrThrow({
    where: {
      id: landlordId,
    },
  });

  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });

  return property;

};




export interface IPropertyQuery extends PropertyWhereInput {
  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;

  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}





const getAllPropertiesFromDB = async (query: IPropertyQuery) => {

  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const amenities = query.amenities? JSON.parse(query.amenities as string) : null;

  const amenitiesArray = Array.isArray(amenities) ? amenities : [];

  const andConditions: PropertyWhereInput[] = [];

  // search
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          city: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }


  // filter

  if (query.city) {
    andConditions.push({
      city: query.city,
    });
  }

  if (query.location) {
    andConditions.push({
      location: query.location,
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  
  if (query.propertyType) {
  andConditions.push({
    propertyType: (query.propertyType as string).toUpperCase() as PropertyType, 
  });
}


  if (query.status) {
  andConditions.push({
    status: (query.status as string).toUpperCase() as PropertyStatus, 
  });
}

  if (query.amenities) {
    andConditions.push({
      amenities: {
        hasSome: amenitiesArray,
      },
    });
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined,
      },
    });
  }



  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });

  const totalPropertyCount = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: properties,
    meta: {
      page: page,
      limit: limit,
      total: totalPropertyCount,
      totalPages: Math.ceil(totalPropertyCount / limit),
    },
  };
};



const getSinglePropertyFromDB = async (id: string) => {

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id
    },

    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
      reviews: true,
      rentalRequests: true,
    },
  });

  return property;

};



const updatePropertyIntoDB = async (id: string,payload: UpdatePropertyPayload,landlordId: string) => {

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id,
    },
  });


  if (property.landlordId !== landlordId) {
    throw new Error("You are not the owner of this property.");
  }


  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: payload.categoryId,
      },
    });
  }


  const updatedProperty = await prisma.property.update({
    where: {
      id,
    },
    data: payload,
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });

  return updatedProperty;

};



const deletePropertyFromDB = async (id: string,landlordId: string) => {

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id,
    },
  });


  if (property.landlordId !== landlordId) {
    throw new Error("You are not the owner of this property.");
  }


  await prisma.property.delete({
    where: {
      id,
    },
  });
};



export const propertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
  getSinglePropertyFromDB,
  updatePropertyIntoDB,
  deletePropertyFromDB,
};