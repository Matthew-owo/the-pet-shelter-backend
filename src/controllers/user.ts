import { Context } from "koa";
import { addFavorite, createUser, getAllFavorite } from "../services/user";
import RegistrationDetails from "../types/RegistrationDetails";

export const createUserHandler = async (ctx: Context): Promise<void> => {
  const registerDetails = ctx.request.body;
  try {
    const newUser = await createUser(registerDetails as RegistrationDetails);
    ctx.body = newUser;
    ctx.status = 201;
  } catch (error) {
    if ((error as any).code) {
      const authErr: any = error;
      ctx.body = {
        message: `${authErr.code}: ${authErr.message}`,
      };
      ctx.status = 201;
    } else {
      console.log(error);
      ctx.body = { message: "Unknown Error: Unable to create user" };
    }
    ctx.status = 500;
  }
};

export const addFavoriteHandler = async (ctx: Context): Promise<void> => {
  const data = ctx.request.body as { userId: string; catId: string };
  try {
    const userId = data.userId;
    const catId = data.catId;
    await addFavorite(userId, catId);
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to add favorite" };
    ctx.status = 500;
  }
};

export const getAllFavoriteHandler = async (ctx: Context): Promise<void> => {
  const data = ctx.request.body as { userId: string };

  try {
    const userId = data.userId;
    const fav = await getAllFavorite(userId);

    ctx.body = fav;
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to get all favorite" };
    ctx.status = 500;
  }
};
