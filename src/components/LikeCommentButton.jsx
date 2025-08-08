import { useState, useEffect } from "react";
import useComments from "../hooks/useComments";
import { Heart } from "phosphor-react";
import '../css/comment.css';
import { useMutation } from "@tanstack/react-query";

export const LikeCommentButton = ({ commentData }) => {
  const { toggleCommentLike } = useComments();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setIsLiked(commentData.liked);
    setLikeCount(commentData.likeCount);
  }, [commentData]);

  const mutation = useMutation({
    mutationFn: (like) =>
      toggleCommentLike({ like, commentId: commentData.id }),

    onSuccess: (_, like) => {
      setIsLiked(like);
      setLikeCount((prev) => prev + (like ? 1 : -1));
    },
    onError: () => {
      // Optionally show a toast or revert the toggle
    }
  });

  const handleToggle = () => {
    if (mutation.isPending) return;
    mutation.mutate(!isLiked);
  };

  return (
    <div className="like_wrapper">
      <button
        onClick={handleToggle}
        disabled={mutation.isPending}
        className="like_btn"
      >
        {isLiked ? (
          <img src="/images/likes/heart_black.svg" alt="liked" />
        ) : (
          <Heart size={20} />
        )}
      </button>
      <div className="like_count">
        {likeCount > 0 ? likeCount : '\u00A0'}
      </div>
    </div>
  );
};


