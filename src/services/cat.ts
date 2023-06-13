import { getAllCats as fetchCats, createCat as addCat } from "../models/cat";
import Cat from "../types/Cat";

/**
 * Retrieve all cats.
 *
 * @returns Promise<Cat[]> - An array of cats.
 */
export const getAllCats = async (): Promise<Cat[]> => {
  return fetchCats();
};

/**
 * Create a new cat.
 *
 * @param newCat - The cat to be created.
 * @returns Promise<Cat> - The created cat.
 */
export const createCat = async (newCat: Cat): Promise<Cat> => {
  return addCat(newCat);
};
