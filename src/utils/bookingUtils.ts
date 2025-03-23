
import { Booking, Property, User } from "@/types";
import { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Convert a Supabase User to our application User type
 */
export const convertSupabaseUserToAppUser = (user: SupabaseUser): User => {
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Guest User',
    email: user.email,
    avatar: user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user.email?.split('@')[0] || 'User'),
    isHost: false, // Default value
    joined: new Date(user.created_at).toISOString(),
    // Optional properties can be undefined
    listings: undefined,
    bookings: undefined
  };
};

/**
 * A helper function to prepare booking data with proper default values
 * for the required nested objects that Booking type needs
 */
export const prepareBookingData = (
  propertyId: string, 
  property: Property,
  userId: string,
  user: SupabaseUser | User,
  startDate: string,
  endDate: string,
  totalPrice: number,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  guests: number
): Omit<Booking, 'id'> => {
  const currentDate = new Date().toISOString();
  
  // Convert Supabase User to App User if needed
  const appUser: User = 'email' in user && 'user_metadata' in user 
    ? convertSupabaseUserToAppUser(user as SupabaseUser)
    : user as User;
  
  return {
    propertyId,
    property,
    userId,
    user: appUser,
    startDate,
    endDate,
    totalPrice,
    status,
    guests,
    createdAt: currentDate
  };
};
