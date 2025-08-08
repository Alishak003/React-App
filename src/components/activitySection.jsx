import { useAuth } from "../contexts/authContext";
import { usePost } from "../hooks/usePost";
import { Card } from "./card";
import { auth } from "../config/firebase-config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "../css/activitySection.css"
import { Create } from "../pages/create";
import { PlusCircle } from "phosphor-react";
import { useNavigate } from "react-router-dom";

export const ActivitySection = ({uid}) => {
  const { getUserPosts } = usePost();
  const { fetchUserDocIdByUID } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId,setUserId] = useState(null)
  const [content, setContent] = useState("");
  const [overlay, setOverlay] = useState(false);
  const {create} = usePost()
  const navigate = useNavigate()


  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
                setUserId(user.uid)
                console.log("user : ",user.uid)
            })
    return()=>unsubscribe()
  },[])
  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      if (!uid) {
        setLoading(false)
        return
      };

      const userId = await fetchUserDocIdByUID(uid);

      if (!userId){
        setLoading(false)
        return;
      }
      console.log("userid",userId)
      const result = await getUserPosts(userId);
      if (result.success) {
        setPosts(result.data);
      } else {
        console.error(result.message);
      }

      setLoading(false);
    };
    fetchActivity()
  }, []);

  const onPostCreated=() => setShouldRefresh(prev => !prev)

  const handleSubmit = async(e) => {
    e.preventDefault();
    const result = await create({content})
    if(result.success){
        navigate('/feed')
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
    <div className="activity-container">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        {userId === uid &&
        <div className="create-btn-sm">
          <button onClick={showOverlay}>NewPost</button>
        </div>}
      </div> 
      <hr />
      {loading ? (
        <p>Loading your activity...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="row">
          {posts.map((post) => 
          <div className="col">
            <Card data={post} key={post.id} />
          </div>)}
        </div>
       
      )}
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
    </div>
  );
};
