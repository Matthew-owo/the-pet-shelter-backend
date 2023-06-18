import admin from "../config/config";

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

export { auth, db, storage };
