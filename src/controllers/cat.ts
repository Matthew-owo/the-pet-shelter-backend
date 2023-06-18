import { Context, DefaultState, Next, ParameterizedContext } from "koa";
import { createCat, getAllCats } from "../services/cat";
import Cat from "../types/Cat";
import Router from "koa-router";

export const getAllCatsHandler = async (
  ctx: Context,
  next: any
): Promise<void> => {
  try {
    const cats = await getAllCats();
    ctx.body = cats;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.body = { message: "Unknown Error: Unable to fetch cats" };
    ctx.status = 500;
  } finally {
    await next();
  }
};

export const createCatHandler = async (
  ctx: ParameterizedContext<
    DefaultState,
    Context & Router.IRouterParamContext<DefaultState, Context>,
    any
  >,
  next: Next
): Promise<void> => {
  const newCatInfo = ctx.request.body;
  const newCatImage = ctx.request.file;

  try {
    const createdCat = await createCat(newCatInfo as Cat, newCatImage);
    ctx.body = createdCat;
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to create cat" };
    ctx.status = 500;
  } finally {
    await next();
  }
};
