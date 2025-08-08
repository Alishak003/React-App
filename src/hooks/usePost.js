import {
  collection,
  getDoc,
  getDocs,
  doc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { useAuth } from "../contexts/authContext";

export const usePost = () => {
  const postsCollectionRef = collection(db, "posts");
  const { fetchUserDocIdByUID } = useAuth();
  const postLikesCollectionRef = collection(db, "post_likes");

  async function getPosts() {
    try {
      const q = query(postsCollectionRef, orderBy("created_at", "desc"));
      const result = await getDocs(q);

      const data = await Promise.all(
        result.docs.map(async (document) => {
          const docData = document.data();
          const postId = document.id;
          const userId = docData.user_id;

          // Fetch user info
          let userData = null;
          if (userId) {
            const userDocRef = doc(db, "users", userId);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              userData = userSnap.data();
            }
          }

          // Fetch likes from "post_likes" where post_id == current post id
          const likesQuery = query(
            postLikesCollectionRef,
            where("post_id", "==", postId)
          );
          const likesSnapshot = await getDocs(likesQuery);
          const likesCount = likesSnapshot.size;

          return {
            ...docData,
            id: postId,
            user: userData,
            likes: likesCount,
          };
        })
      );

      return { success: true, data };
    } catch (error) {
      console.log("error fetching posts with likes", error);
      return { success: false, message: error.message };
    }
  }

  async function create({ content }) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const userId = await fetchUserDocIdByUID(user.uid);
      const newPost = {
        content,
        user_id: userId,
        created_at: serverTimestamp(),
      };

      const docRef = await addDoc(postsCollectionRef, newPost);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function getUserPosts(userId) {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);

      const posts = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const docData = document.data();
          const userId = docData.user_id;
          if (userId) {
            const userDocRef = doc(db, "users", userId);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              return {
                ...docData,
                id: document.id,
                user: userSnap.data(),
              };
            } else {
              return {
                ...docData,
                id: docData.id,
              };
            }
          } else {
            return {
              ...docData,
              id: docData.id,
            };
          }
        })
      );

      return { success: true, data: posts };
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
      return { success: false, message: error.message };
    }
  }

  return { getPosts, create, getUserPosts };
};
