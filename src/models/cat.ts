import { db } from "../utils/Firebase";
import Cat from "../types/Cat";

/**
 * Retrieve all cats from the database.
 *
 * @returns Promise<Cat[]> - An array of cats.
 */
export const getAllCats = async (): Promise<Cat[]> => {
  const collectionRef = db.collection("cats");

  // Retrieve the snapshot of the collection
  const snapshot = await collectionRef.get();
  const cats: Cat[] = [];

  // Iterate over each document in the snapshot
  snapshot.forEach((doc) => {
    // Extract the cat data from the document
    const catData = doc.data() as Cat;
    cats.push(catData);
  });

  return cats;
};

/**
 * Create a new cat in the database.
 *
 * @param catData - The cat data to be created.
 * @returns Promise<Cat> - The created cat.
 */
export const createCat = async (newCat: Cat): Promise<Cat> => {
  const { name, age, breed } = newCat;

  // Check if any required fields are missing
  if (!name || !age || !breed) {
    throw new Error("Missing fields");
  }

  const collectionRef = db.collection("cats");

  // Add the new cat to the collection
  const docRef = await collectionRef.add(newCat);
  const createdCat: Cat = { id: docRef.id, ...newCat };

  return createdCat;
};
