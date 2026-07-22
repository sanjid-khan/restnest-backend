import { z } from "zod";
import {
  PropertyStatus,
  PropertyType,
} from "../../../generated/prisma/enums";

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title cannot exceed 255 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),

    address: z
      .string()
      .trim()
      .min(5, "Address is required"),

    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    location: z
      .string()
      .trim()
      .optional(),

    price: z
      .number()
      .positive("Price must be greater than 0"),

    bedrooms: z
      .number()
      .int()
      .positive()
      .optional(),

    bathrooms: z
      .number()
      .int()
      .positive()
      .optional(),

    areaSqft: z
      .number()
      .int()
      .positive()
      .optional(),

    propertyType: z
     .enum(Object.values(PropertyType) as [string, ...string[]])
     .optional(),
     
  }),
});


const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3)
      .max(255)
      .optional(),

    description: z
      .string()
      .trim()
      .min(10)
      .optional(),

    address: z
      .string()
      .trim()
      .min(5)
      .optional(),

    city: z
      .string()
      .trim()
      .min(2)
      .optional(),

    location: z
      .string()
      .trim()
      .optional(),

    price: z
      .number()
      .positive()
      .optional(),

    bedrooms: z
      .number()
      .int()
      .positive()
      .optional(),

    bathrooms: z
      .number()
      .int()
      .positive()
      .optional(),

    areaSqft: z
      .number()
      .int()
      .positive()
      .optional(),


    propertyType: z.
    enum(Object.values(PropertyType) as [string, ...string[]])
    .optional(),
      

    status: z
      .enum(Object.values(PropertyStatus) as [string, ...string[]])
      .optional(),
  }),
});


export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};