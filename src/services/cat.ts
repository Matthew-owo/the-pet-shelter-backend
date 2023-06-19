import multer from "@koa/multer";
import {
  getAllCats as fetchCats,
  getCatById as fetchCatById,
  getCatByName as fetchCatByName,
  createCat as addCat,
  updateCat as modifyCat,
  removeCat as deleteCat,
} from "../models/cat";
import Cat from "../types/Cat";

/**
 * Retrieve all cats.
 *
 * @returns Promise<Cat[]> - An array of cats.
 */
export const getAllCats = async (): Promise<Cat[]> => {
  return fetchCats();
};

export const getCatById = async (catId: string) => {
  return fetchCatById(catId);
};

export const getCatByName = async (catId: string) => {
  return fetchCatByName(catId);
};

/**
 * Create a new cat.
 *
 * @param newCat - The cat to be created.
 * @returns Promise<Cat> - The created cat.
 */
export const createCat = async (
  newCat: Cat,
  newCatImage: multer.File
): Promise<Cat> => {
  return addCat(newCat, newCatImage);
};

export const updateCat = async (
  updateCatData: Cat,
  updateCatImage: multer.File
) => {
  return modifyCat(updateCatData, updateCatImage);
};

export const removeCat = async (catId: string) => {
  return deleteCat(catId);
};
