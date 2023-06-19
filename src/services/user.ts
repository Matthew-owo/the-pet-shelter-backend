import User from "../types/User";
import RegistrationDetails from "../types/RegistrationDetails";
import {
  createUser as addUser,
  addFavorite as addMyFavorite,
  getAllFavorite as getAllMyFavorite,
} from "../models/user";
import UserFavorite from "../types/UserFavorite";

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

export const addFavorite = async (
  userId: string,
  catId: string
): Promise<{
  userId: string;
  catId: string;
}> => {
  return await addMyFavorite(userId, catId);
};

export const getAllFavorite = async (
  userId: string
): Promise<UserFavorite[]> => {
  return await getAllMyFavorite(userId);
};
