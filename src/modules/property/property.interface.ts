import { PropertyStatus, PropertyType } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";


export interface CreatePropertyPayload {
  title: string;
  description: string;
  address: string;
  city: string;
  location?: string;

  price: number;

  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;

  propertyType: PropertyType;
  categoryId: string;
}


export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  location?: string;

  price?: number;

  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;

  propertyType?: PropertyType;
  categoryId?: string;

  status?: PropertyStatus;
}



export interface IPropertyQuery extends PropertyWhereInput {

  title?: string;
  city?: string;
  location?: string;
  propertyType?: PropertyType;
  categoryId?: string;
  status?: PropertyStatus;

  minPrice?: string;
  maxPrice?: string;

  searchTerm?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: string;
}

