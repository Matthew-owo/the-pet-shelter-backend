import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { createCatHandler, getAllCatsHandler } from "../controllers/cat";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

export const setupCatRoutes = (router: Router): void => {
  const catRouter = new Router({ prefix: "/api/v1/cat" });

  catRouter.get("/", getAllCatsHandler);
  catRouter.post(
    "/create",
    isAuthenticated,
    isAuthorized({ hasRole: ["employee"] }),
    bodyParser(),
    createCatHandler
  );

  router.use(catRouter.routes());
};
