import User from "../types/User";
import RegistrationDetails from "../types/RegistrationDetails";
import { createUser as addUser } from "../models/user";

/**
 * Create a new user.
 *
 * @param registerDetails - The registration details of the user.
 * @returns Promise<User> - The created user.
 */
export const createUser = async (
  registerDetails: RegistrationDetails
): Promise<User> => {
  return await addUser(registerDetails);
};
