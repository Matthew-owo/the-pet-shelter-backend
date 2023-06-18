// Import packages
import Koa, { Context, DefaultState } from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import cors from "@koa/cors";
import { setupCatRoutes } from "./routes/cat";
import { setupUserRoutes } from "./routes/user";

const app: Koa = new Koa();
const router = new Router<DefaultState, Context>();

app.use(cors({ origin: "*" }));

setupUserRoutes(router);
setupCatRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods);
app.use(json());
app.use(logger());

export default app;
