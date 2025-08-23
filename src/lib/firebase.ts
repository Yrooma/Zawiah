// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "collabpost-rehtm",
  appId: "1:959254466273:web:81c2c2149c84d6234a31a0",
  storageBucket: "collabpost-rehtm.firebasestorage.app",
  apiKey: "AIzaSyB-TnEPMMnredCFt7F8867A32KF6iVnNH0",
  authDomain: "collabpost-rehtm.firebaseapp.com",
  messagingSenderId: "959254466273"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
