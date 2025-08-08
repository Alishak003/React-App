// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../config/firebase-config";
import { collection, query, where, getDocs, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const createUserProfile = async(data)=>{
    try {
      const usersRef = collection(db,'users');
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not authenticated");
      const newProfile = {
        bio:data.bio,
        name:data.fullName,
        created_at:serverTimestamp(),
        uid:uid,
        location:data.location,
        photoURL:data.avatar
      }

      const docRef = await addDoc(usersRef,newProfile);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.log("error",error.message)
      return { success: false, message: error.message };
    }
  }

  const fetchUserDocIdByUID = async(uid) => {
    console.log(uid)
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.id;
      } else {
        console.warn("No user found with this UID");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by UID:", error.message);
      return null;
    }
  };

 const fetchUserDataByUID = async(uid)=>{
  try {
    console.log('target: ',uid)
    const usersRef = collection(db,'users')
    const q = query(usersRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
     if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data()
      const email = auth.currentUser?.email
      data.email=email
      return {success:true,data:data};
    } else {
      console.warn("No user found with this UID");
      return {success:false,message:"No user found with this UID"};
    }
  } catch (error) {
   console.log(error.message) 
  }
 }

  return (
    <AuthContext.Provider value={{ user, loading,fetchUserDocIdByUID,fetchUserDataByUID,createUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
