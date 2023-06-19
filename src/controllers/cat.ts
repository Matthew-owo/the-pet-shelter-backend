import { Context, DefaultState, Next, ParameterizedContext } from "koa";
import {
  createCat,
  getAllCats,
  getCatById,
  getCatByName,
  removeCat,
} from "../services/cat";
import Cat from "../types/Cat";
import Router from "koa-router";
import { updateCat } from "../models/cat";

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

export const getCatByIdHandler = async (
  ctx: ParameterizedContext<
    DefaultState,
    Context & Router.IRouterParamContext<DefaultState, Context>,
    any
  >,
  next: Next
): Promise<void> => {
  const catId = ctx.params.id;
  try {
    const cat = await getCatById(catId);

    if (cat) {
      ctx.body = cat;
      ctx.status = 200;
    } else {
      ctx.body = { message: "No cat found" };
      ctx.status = 404;
    }
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to fetch cat" };
    ctx.status = 500;
  } finally {
    await next();
  }
};

export const getCatByNameHandler = async (
  ctx: ParameterizedContext<
    DefaultState,
    Context & Router.IRouterParamContext<DefaultState, Context>,
    any
  >,
  next: Next
) => {
  const catName = ctx.params.name;

  try {
    const cats = await getCatByName(catName);

    ctx.body = cats;
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to fetch cat" };
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

export const updateCatHandler = async (
  ctx: ParameterizedContext<
    DefaultState,
    Context & Router.IRouterParamContext<DefaultState, Context>,
    any
  >,
  next: Next
): Promise<void> => {
  const updateCatData = ctx.request.body;
  const updateCatImage = ctx.request.file;

  try {
    await updateCat(updateCatData as Cat, updateCatImage);
    ctx.body = { message: "Cat updated" };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to update cat" };
    ctx.status = 500;
  } finally {
    await next();
  }
};

export const removeCatHandler = async (
  ctx: ParameterizedContext<
    DefaultState,
    Context & Router.IRouterParamContext<DefaultState, Context>,
    any
  >,
  next: Next
): Promise<void> => {
  const data = ctx.request.body as { id: string };

  try {
    await removeCat(data.id);
    ctx.body = { message: "Cat removed" };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: "Unknown Error: Unable to remove cat" };
    ctx.status = 500;
  } finally {
    await next();
  }
};
