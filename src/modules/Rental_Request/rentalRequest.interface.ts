import { RentalRequestStatus } from "../../../generated/prisma/enums";

export interface CreateRentalRequestPayload {
  propertyId: string;
  moveInDate: Date;
  message?: string;
}

export interface UpdateRentalRequestPayload {
  status: RentalRequestStatus;
}