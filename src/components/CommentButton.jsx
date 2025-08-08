import '../css/comment.css'
import { useEffect, useState } from 'react';
import useComments from '../hooks/useComments';
import { ChatCircle } from 'phosphor-react';


const CommentButton = ({ postId, ...props }) => {
    const {fetchCommentCount} = useComments()
    const [commentCount,setCommentCount] = useState(0)
    
    useEffect(()=>{
      const getCount = async()=>{
        const count =  await fetchCommentCount(postId)
        if(count.success){
        setCommentCount(count.data)
        }
        else{
        }
      }
      getCount();
    },[postId])
 
    return (
    <button className="comment-button" {...props}>
      <ChatCircle size={20} weight="regular" />
      <span>{commentCount > 0 ? ` ${commentCount} Comment${commentCount > 1 ? 's' : ''}` : 'Comment'}</span>
    </button>
  );
};

export default CommentButton;
