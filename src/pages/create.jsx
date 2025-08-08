import { useState } from "react";
import "../css/create.css";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router-dom";

export const Create = ({onPostCreated}) => {
  const [content, setContent] = useState("");
  const [overlay, setOverlay] = useState(false);
  const {create} = usePost()
  const navigate = useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("content", content);
    const result = await create({content})
    if(result.success){
        console.log("ho gaya")
    }else{
        console.log(result.message)
    }
    setContent("")
    setOverlay(false)
    onPostCreated()
  };

  const showOverlay = () => {
    setOverlay(true);
  };

  const closeOverlay = () => {
    setOverlay(false);
  };

  return (
    <>
      <div className="create-post-container">
        <button className="start-btn" onClick={showOverlay}>Start a post</button>
      </div>

      {overlay && (
        <div className="overlay">
          <form className="post-form" onSubmit={handleSubmit}>
            <button type="button" className="close-btn" onClick={closeOverlay}>
              ×
            </button>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </>
  );
};
