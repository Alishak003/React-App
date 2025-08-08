import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../config/firebase-config";

export async function register({ email, password }) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result?.user) {
      const user = result.user;
      return { success: true, data: user };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function googleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result?.user) {
      const user = result.user;
      try {
        
      } catch (error) {
        
      }
      return { success: true, data: user };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function login({ email, password }) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result?.user) {
      const user = result.user;
      return { success: true, data: user };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Logout failed: " + error.message);
  }
}
