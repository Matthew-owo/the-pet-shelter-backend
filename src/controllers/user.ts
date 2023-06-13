import { Context } from "koa";
import { createUser } from "../services/user";
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
    } else {
      console.log(error);
      ctx.body = { message: "Unknown Error: Unable to create user" };
    }
    ctx.status = 500;
  }
};
