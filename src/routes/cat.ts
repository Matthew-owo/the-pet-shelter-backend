import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import multer from "@koa/multer";
import {
  createCatHandler,
  getAllCatsHandler,
  getCatByIdHandler,
  getCatByNameHandler,
  removeCatHandler,
  updateCatHandler,
} from "../controllers/cat";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";
import { Context, DefaultState } from "koa";

export const setupCatRoutes = (router: Router<DefaultState, Context>): void => {
  const catRouter = new Router<DefaultState, Context>({
    prefix: "/api/v1/cat",
  });

  const upload = multer({
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback(new Error("Please upload an image"), false);
      }
      callback(null, true);
    },
    dest: "temp",
  });

  catRouter.get("/", getAllCatsHandler);

  catRouter.get("/:id", getCatByIdHandler);

  catRouter.get("/query/:name", getCatByNameHandler);

  catRouter.post(
    "/create",
    isAuthenticated,
    isAuthorized({ hasRole: ["employee"] }),
    bodyParser(),
    upload.single("image"),
    createCatHandler
  );

  catRouter.put(
    "/update",
    isAuthenticated,
    isAuthorized({ hasRole: ["employee"] }),
    bodyParser(),
    upload.single("image"),
    updateCatHandler
  );

  catRouter.delete(
    "/delete",
    isAuthenticated,
    isAuthorized({ hasRole: ["employee"] }),
    bodyParser(),
    removeCatHandler
  );

  router.use(catRouter.routes());
};
