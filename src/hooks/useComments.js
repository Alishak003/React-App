import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase-config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

export default function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { fetchUserDataByUID } = useAuth();
  const currentUser = auth.currentUser?.uid;

  async function fetchCommentCount(postId) {
    try {
      const q = query(
        collection(db, "comments"),
        where("post_id", "==", postId)
      );
      const snapshot = await getDocs(q);
      return { success: true, data: snapshot.size };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function fetchComments(postId) {
    try {
      const q = query(
        collection(db, "comments"),
        where("post_id", "==", postId),
        orderBy("created_at", "desc")
      );
      const snapshot = await getDocs(q);
      const commentsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const comment = docSnap.data();
          const profileRes = await fetchUserDataByUID(comment.user_id);
          const likes = await fetchCommentLikes(docSnap.id);

          return {
            ...comment,
            id: docSnap.id,
            likeCount: likes.data.length,
            liked:
              likes.data.userId === currentUser &&
              likes.data.isLiked === 1,
            user: profileRes.success ? profileRes.data.name : "Unknown User",
          };
        })
      );
      return { success: true, data: commentsData };
    } catch (error) {
      console.log("error fetching comments", error);
      return { success: false, message: "Unable to fetch comments" };
    }
  }

  async function postComment(postId, commentValue, parentId = null) {
    try {
      await addDoc(collection(db, "comments"), {
        post_id: postId,
        user_id: currentUser,
        content: commentValue,
        parent_id: parentId,
        created_at: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function createComment(postId, comment) {
    return postComment(postId, comment.content, comment.parentId);
  }

  async function toggleCommentLike({ like, commentId }) {
    try {
      const likesRef = collection(db, "comment_likes");
      const q = query(
        likesRef,
        where("comment_id", "==", commentId),
        where("user_id", "==", currentUser)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const likeDoc = snapshot.docs[0];
        await updateDoc(doc(db, "comment_likes", likeDoc.id), {
          status: like ? 1 : -1,
        });
      } else {
        await addDoc(likesRef, {
          comment_id: commentId,
          user_id: currentUser,
          status: like ? 1 : -1,
        });
      }
      return { success: true };
    } catch (error) {
      console.log("error toggling comment like", error);
      return { success: false, message: error.message };
    }
  }

  async function fetchCommentLikes(commentId) {
    try {
      const q = query(
        collection(db, "comment_likes"),
        where("comment_id", "==", commentId),
        where("status", "==", 1)
      );
      const snapshot = await getDocs(q);
      let userId = snapshot.docs.find(
        (doc) => doc.data().user_id === currentUser
      )?.data().user_id;
      return {
        success: true,
        data: {
          length: snapshot.size,
          userId: userId || null,
          isLiked: !!userId ? 1 : -1,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  return {
    comments,
    loading,
    error,
    fetchCommentCount,
    fetchComments,
    postComment,
    createComment,
    toggleCommentLike,
  };
}
