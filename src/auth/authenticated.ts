import { Context } from "koa";
import dayjs from "dayjs";
import admin from "../config/config";
import { auth } from "../utils/Firebase";
import CurrentUser from "../types/CurrentUser";

/**
 * Middleware function to validate the authorization information of a request
 * @param ctx Koa's Context object
 * @param next Koa's next function
 */
export const isAuthenticated = async (ctx: Context, next: any) => {
  const { authorization } = ctx.headers;
  const split = authorization?.split("Bearer ");

  // Check if the authorization information is valid
  if (
    !authorization ||
    !authorization.startsWith("Bearer ") ||
    split?.length !== 2
  ) {
    ctx.throw(401, "Unauthorized");
  }

  const token = split[1];

  try {
    // Verify the authorization token
    const decodedToken: admin.auth.DecodedIdToken = await auth.verifyIdToken(
      token
    );

    // Check if the token is not expired
    if (dayjs().unix() > decodedToken.exp) {
      ctx.throw(401, "Unauthorized");
    }

    // Build the current user object
    const currentUser: CurrentUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    ctx.state.currentUser = currentUser;

    // Continue to the next middleware
    await next();
  } catch (error) {
    // Handle errors
    if ((error as any).code) {
      const authErr: any = error;
      console.error(`${authErr.code} - ${authErr.message}`);
      ctx.throw(401, "Unauthorized");
    } else {
      console.error(error);
      ctx.throw(401, "Unauthorized");
    }
  }
};
