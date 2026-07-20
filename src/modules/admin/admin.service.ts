import { Prisma } from "../../../generated/prisma/client";
import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { PropertyStatus,PropertyType } from "../../../generated/prisma/enums";
import { IPropertyQuery } from "../property/property.interface";


const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const updateUserStatus = async (
  userId: string,
  payload: {
    userStatus: UserStatus;
  }
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      userStatus: payload.userStatus,
    },

    omit: {
      password: true,
    },
  });

  return user;
};

const getAllProperties = async (query: IPropertyQuery) => {

  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const amenities = query.amenities
    ? JSON.parse(query.amenities as string)
    : null;

  const amenitiesArray = Array.isArray(amenities) ? amenities : [];

  const andConditions: Prisma.PropertyWhereInput[] = [];

  // Search
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

  // Filters
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
      propertyType: query.propertyType.toUpperCase() as PropertyType,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status.toUpperCase() as PropertyStatus,
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
    skip,

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
      page,
      limit,
      total: totalPropertyCount,
      totalPages: Math.ceil(totalPropertyCount / limit),
    },
  };
};

const getAllRentalRequests = async () => {
  const rentals = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },

      property: true,

      payments: true,

      review: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};

export const adminServices = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};