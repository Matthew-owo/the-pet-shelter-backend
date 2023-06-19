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

export const getCatById = async (catId: string): Promise<Cat> => {
  const collectionRef = db.collection("cats");

  const docRef = collectionRef.doc(catId);

  const doc = await docRef.get();

  const cat = doc.data() as Cat;

  return { ...cat, id: catId };
};

export const getCatByName = async (catName: string): Promise<Cat[]> => {
  const collectionRef = db.collection("cats");

  const query = collectionRef.where("name", "==", catName);

  const snapshot = await query.get();

  const cat: Cat[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as Cat;
    cat.push({ ...data, id: doc.id });
  });

  return cat;
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
  const fileName = `${docRef.id}.jpg`;

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

export const updateCat = async (catData: Cat, catImage?: multer.File) => {
  const { id, name, age, breed } = catData;

  let imageUrl = "";
  console.log(catImage);
  if (catImage) {
    const fileExtName = path.extname(catImage.originalname);
    const fileName = `${id}${fileExtName}`;

    const bucket = storage.bucket("the-pet-shelter-89369.appspot.com");

    const oldImage = bucket.file(fileName);
    await oldImage.delete();

    const imageResponse = await bucket.upload(catImage.path, {
      destination: fileName,
    });

    imageUrl = `https://firebasestorage.googleapis.com/v0/b/the-pet-shelter-89369.appspot.com/o/${imageResponse[0].name}?alt=media`;
  }

  const collectionRef = db.collection("cats");
  const docRef = collectionRef.doc(id!);

  if (imageUrl) {
    return docRef.update({ name, age, breed, image: imageUrl });
  }

  return docRef.update({ name, age, breed });
};

export const removeCat = async (catId: string) => {
  const collectionRef = db.collection("cats");
  const docRef = collectionRef.doc(catId);

  await docRef.delete();

  const bucket = storage.bucket("the-pet-shelter-89369.appspot.com");

  const fileName = `${catId}.jpg`;
  const image = bucket.file(fileName);

  await image.delete();
};
