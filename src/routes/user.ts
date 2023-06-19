import { Context, DefaultState } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import {
  addFavoriteHandler,
  createUserHandler,
  getAllFavoriteHandler,
} from "../controllers/user";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

export const setupUserRoutes = (
  router: Router<DefaultState, Context>
): void => {
  const userRouter = new Router<DefaultState, Context>({
    prefix: "/api/v1/users",
  });

  userRouter.post("/create", bodyParser(), async (ctx: Context) =>
    createUserHandler(ctx)
  );

  userRouter.post(
    "/addFavorite",
    isAuthenticated,
    isAuthorized({ hasRole: ["employee", "user"] }),
    bodyParser(),
    addFavoriteHandler
  );

  userRouter.post(
    "/getFavorite",
    isAuthenticated,
    isAuthorized({ hasRole: ["employee", "user"] }),
    bodyParser(),
    getAllFavoriteHandler
  );

  router.use(userRouter.routes());
};
