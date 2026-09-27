import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvR_VsHJSLjWobMRF07AhsHONX7u41-Hs",
  authDomain: "dillicrush.firebaseapp.com",
  projectId: "dillicrush",
  storageBucket: "dillicrush.firebasestorage.app",
  messagingSenderId: "541571370525",
  appId: "1:541571370525:web:9c54480630c7e21d9580f4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
