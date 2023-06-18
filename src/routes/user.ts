import { Context, DefaultState } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { createUserHandler } from "../controllers/user";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

export const setupUserRoutes = (router: Router<DefaultState, Context>): void => {
  const userRouter = new Router({ prefix: "/api/v1/users" });

  userRouter.post("/create", bodyParser(), async (ctx: Context) =>
    createUserHandler(ctx)
  );

  router.use(userRouter.routes());
};
