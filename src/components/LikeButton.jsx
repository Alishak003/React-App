// components/LikeButton.jsx
import { Heart } from "phosphor-react";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../css/likeButton.css";

export const LikeButton = ({ postId }) => {
  const user = auth.currentUser;
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch likes on mount or when postId/user changes
  const fetchLikes = async () => {
    const likesRef = collection(db, "post_likes");
    const q = query(likesRef, where("postId", "==", postId));
    const querySnapshot = await getDocs(q);

    let count = 0;
    let userLikeId = null;

    querySnapshot.forEach((doc) => {
      count++;
      if (doc.data().userId === user?.uid) {
        userLikeId = doc.id;
      }
    });

    setLikeCount(count);
    setLiked(!!userLikeId);
    setLikeId(userLikeId);
  };

  useEffect(() => {
    if (user && postId) {
      fetchLikes();
    }
  }, [postId, user]);

  // Like or unlike post
  const handleLikeToggle = async () => {
    const likesRef = collection(db, "post_likes");

    if (!liked) {
      const newDoc = await addDoc(likesRef, {
        postId,
        userId: user.uid,
        createdAt: new Date(),
      });
      setLiked(true);
      setLikeId(newDoc.id);
      setLikeCount((prev) => prev + 1);
    } else {
      await deleteDoc(doc(db, "post_likes", likeId));
      setLiked(false);
      setLikeId(null);
      setLikeCount((prev) => prev - 1);
    }
  };

  return (
    <button onClick={handleLikeToggle} className="like-btn" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <Heart weight={liked ? "fill" : "regular"} size={20} color={liked ? "red" : "black"} />
      <span>{likeCount}</span>
    </button>
  );
};
