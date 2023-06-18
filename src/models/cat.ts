import { db, storage } from "../utils/Firebase";
import Cat from "../types/Cat";
import multer from "@koa/multer";
import path from "path";
import fs from "fs";
import dayjs from "dayjs";

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
    cats.push({
      ...catData,
      id: doc.id,
      createTime: doc.createTime.toDate().toString(),
    });
  });

  return cats;
};

/**
 * Create a new cat in the database.
 *
 * @param catData - The cat data to be created.
 * @returns Promise<Cat> - The created cat.
 */
export const createCat = async (
  newCat: Cat,
  newCatImage: multer.File
): Promise<Cat> => {
  const { name, age, breed } = newCat;

  // Check if any required fields are missing
  if (!name || !age || !breed || !newCatImage) {
    throw new Error("Missing fields");
  }

  const collectionRef = db.collection("cats");

  // Add the new cat to the collection
  const docRef = await collectionRef.add(newCat);

  const fileExtName = path.extname(newCatImage.originalname);
  const fileName = `${docRef.id}${fileExtName}`;

  const bucket = storage.bucket("the-pet-shelter-89369.appspot.com");

  const imageResponse = await bucket.upload(newCatImage.path, {
    destination: fileName,
  });

  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/the-pet-shelter-89369.appspot.com/o/${imageResponse[0].name}?alt=media`;

  await docRef.update({ image: imageUrl });

  const createdCat: Cat = { id: docRef.id, ...newCat, imageUrl: imageUrl };

  fs.unlink(newCatImage.path, (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });

  return createdCat;
};
