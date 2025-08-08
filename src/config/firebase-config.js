// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCQmd0W18sa_0U7E0HqHATAiRUabK-mguU",
  authDomain: "minilinkedin-cbed9.firebaseapp.com",
  projectId: "minilinkedin-cbed9",
  storageBucket: "minilinkedin-cbed9.firebasestorage.app",
  messagingSenderId: "509341000874",
  appId: "1:509341000874:web:57c7f04ca9604ca8505cd3",
  measurementId: "G-NY4Y2Q8HQD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
