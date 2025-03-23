
import { Booking, Property, User } from "@/types";

/**
 * A helper function to prepare booking data with proper default values
 * for the required nested objects that Booking type needs
 */
export const prepareBookingData = (
  propertyId: string, 
  property: Property,
  userId: string,
  user: User,
  startDate: string,
  endDate: string,
  totalPrice: number,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  guests: number
): Omit<Booking, 'id'> => {
  const currentDate = new Date().toISOString();
  
  return {
    propertyId,
    property,
    userId,
    user,
    startDate,
    endDate,
    totalPrice,
    status,
    guests,
    createdAt: currentDate
  };
};
