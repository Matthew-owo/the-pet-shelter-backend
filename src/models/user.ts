import User from "../types/User";
import RegistrationDetails from "../types/RegistrationDetails";
import { auth, db } from "../utils/Firebase";
import "dotenv/config";
import UserFavorite from "../types/UserFavorite";

/**
 * Create a user with email and password, if provided valid signUpCode that will be a employee role.
 *
 * @param registerDetails - The registration details of the user.
 * @returns Promise<User> - The newly created user.
 * @throws Error - If any required fields are missing or firebase authentication error occured.
 */
export const createUser = async (
  registerDetails: RegistrationDetails
): Promise<User> => {
  const { email, password, displayName, signUpCode } = registerDetails;

  // Check if any required fields are missing
  if (!email || !password || !displayName) {
    throw new Error("Missing fields");
  }

  let role = "user";

  // Retrieve the sign-up code from environment variables
  const SIGN_UP_CODE = process.env.SIGN_UP_CODE;

  // Check if the provided sign-up code matches the expected sign-up code
  if (signUpCode === SIGN_UP_CODE) {
    role = "employee";
  }

  // Create a new user in Firebase Authentication
  const { uid } = await auth.createUser({
    email,
    password,
    displayName,
  });

  // Set custom user claims to assign the user role
  await auth.setCustomUserClaims(uid, { role });

  // Create a User object with the user details
  const newUser: User = {
    uid,
    displayName,
    email,
    role,
  };

  return newUser;
};

export const addFavorite = async (userId: string, catId: string) => {
  const collectionRef = db.collection("favorite");
  await collectionRef.add({ userId, catId });
  return { userId, catId };
};

export const getAllFavorite = async (
  userId: string
): Promise<UserFavorite[]> => {
  const collectionRef = db.collection("favorite");

  const snapshot = await collectionRef.get();
  const fav: UserFavorite[] = [];

  snapshot.forEach((doc) => {
    const favData = doc.data() as UserFavorite;
    if (favData.userId === userId) {
      fav.push({
        ...favData,
      });
    }
  });

  return fav;
};
