import admin from "../config/config";

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
