import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "./serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: "gs://the-pet-shelter-89369.appspot.com"
});

export default admin;