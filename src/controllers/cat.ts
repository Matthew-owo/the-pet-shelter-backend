import { Context } from "koa";
import { createCat, getAllCats } from "../services/cat";
import Cat from "../types/Cat";

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
  ctx: Context,
  next: any
): Promise<void> => {
  const newCat = ctx.request.body;

  try {
    const createdCat = await createCat(newCat as Cat);
    ctx.body = createdCat;
    ctx.status = 201;
  } catch (error) {
    ctx.body = { message: "Unknown Error: Unable to create cat" };
    ctx.status = 500;
  } finally {
    await next();
  }
};
