import { useEffect, useRef, useState } from 'react';
import '../css/comment.css'
import { PaperPlaneRight, UserCircle } from 'phosphor-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LikeCommentButton } from './LikeCommentButton';
// import {LoginPromptModal} from './LoginPromptModal'
import useComments from '../hooks/useComments';
import { CaretDown, CaretUp } from 'phosphor-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { Link } from 'react-router-dom';

export const CommentComponent = ({postId}) =>{
  const {createComment,fetchComments} = useComments()
  const [isReplying,setIsReplying] = useState(null)
  const [replyPrefix,setReplyPrefix] = useState("")
  const [parentId, setParentId] = useState(null)
  const [showDiv,setShowDiv] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [placeHolderText, setPlaceHolderText] = useState("Add a comment...")
  const[currentUser,setCurrentUser] = useState(null)
  const queryClient = useQueryClient()

  useEffect(()=>{
          const cribe = onAuthStateChanged(auth, async (user) => {
               setCurrentUser(user?.uid)
          })
          return()=>cribe()
  },[])

  useEffect(()=>{
    if(!currentUser){
      setIsLoggedIn(false)
      setPlaceHolderText("Sign in to Comment...")
    }else{
      setIsLoggedIn(true)
      setPlaceHolderText("Add a comment...")

    }
  },[currentUser])

  const {
    data:comments,isLoading,error
  } = useQuery({
    queryKey: ['comments',postId],
    queryFn:()=> fetchComments(postId)
  })


  const {mutate, isPending, isError} = useMutation({
      mutationFn: (newComment) => createComment(postId, newComment),
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey:['comments',postId]})
      }
  })


  const InputBox = () => {
    const inputRef = useRef(null)
    const [commentValue, setCommentValue] = useState("")
    useEffect(() => {
    if (isReplying && replyPrefix) {
      setCommentValue(`${replyPrefix}`);
      inputRef.current?.focus();
    }
  }, [isReplying, replyPrefix]);

    const dismissReply = ()=>{
      setParentId(null)
      setIsReplying(false)
      setReplyPrefix("")
    }

    const handleChange = (e) => {
      if(!isLoggedIn){
        setShowDiv(true)
        return
      }
      const value = e.target.value;

      // Prevent user from deleting the prefix
      if (isReplying && !value.startsWith(replyPrefix)) {
        return;
      }

      setCommentValue(value);
    };

    const handleKeyDown = (e) => {
      if(!isLoggedIn){
        setShowDiv(true)
        return
      }
      // Block backspace before prefix length
      if (
        isReplying &&
        inputRef.current.selectionStart <= replyPrefix.length &&
        e.key === "Backspace"
      ) {
        e.preventDefault();
      }
    };

    const handleSubmit = (e) =>{
        e.preventDefault()
        const content = commentValue.slice(replyPrefix.length);
        if (!content.trim()) return
        if (!currentUser){
          setShowDiv(true)
          return
        }
        mutate ({content:content, parentId:parentId})
        setCommentValue("")
        setIsReplying(false)
        setParentId(null)
    }   

    return (
    <div className="input-box-container">
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            className="comment-input"
            placeholder={placeHolderText}
            value={commentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          {isReplying && replyPrefix && (
            <button
              type="button"
              onClick={dismissReply}
              className="clear-reply-btn"
              aria-label="Cancel reply"
            >
              &times;
            </button>
          )}
        </div>
        <button
          type="submit"
          className="comment-post-btn"
          disabled={!commentValue.trim() || isPending}
        >
          <PaperPlaneRight size={24} weight="fill" />
        </button>
      </form>
      {isError && <p>Error posting Comment</p>}
    </div>
  );
  }


  const buildCommentTree = (flatComments)=>{
    const map = new Map();
    const roots = [];

     flatComments.forEach((comment) => {
      if(comment.parent_id){
        map.set(comment.id,{...comment,subParent:[]})
      }
      else{
        map.set(comment.id,{...comment,children:[]})
      }
     });

    const getRootParent = ((comment)=>{
      if(comment.parent_id) {
        return getRootParent(map.get(comment.parent_id))
      }
      else{
        return comment
      }
    })

     flatComments.forEach((comment) =>{
      if(comment.parent_id){
        
        const parent = getRootParent(comment)
        const mappedComment = map.get(comment.id); //
        // const subParent = ()
        // console.log("subParent : ",subParent)
        mappedComment.subParent?.push(map.get(comment.parent_id))

        // console.log("parent  for  ",comment.id,":",parent)
        if(parent){
          parent.children?.unshift(map.get(comment.id));
        }
      }
      else{
          roots.push(map.get(comment.id))
        }
     })
     return roots;
  }


  const commentTree = comments?.success ? buildCommentTree(comments.data) :[] 


  const CommentReplyItem = ({comment,taggedUser}) =>{
    const [activeReplying,setActiveReplying] = useState(false)
     const commentData = {
        id:comment.id,
        likeCount: comment.likeCount || 0,
        liked:comment.liked || false
    }
      const onReplyClick = (comment)=>{
        setIsReplying(true)
        setActiveReplying(!activeReplying)
        setReplyPrefix(`@${comment.user}: `)
        setParentId(comment.id)
      }
      return (
          <div className="comment-reply"  key={comment.id} >
              <div className='comment-container-row'>
                  <div className="comment-container-col comment-reply-img">
                    <UserCircle size={32}/>
                  </div>
                  <div className="comment-container-col">
                      <h6>{comment.user || "Anonymous"}</h6>
                      <p>
                        {taggedUser && <span className="tagged-user">@{taggedUser} </span>}
                        {comment.content}
                      </p>
                      <button onClick={()=>onReplyClick(comment)}className='reply-btn'>{activeReplying ? 'Cancel':'Reply'}</button>
                  </div>
                  {/* <div className="comment-container-col">
                      <LikeCommentButton commentData={commentData}/>
                  </div> */}
              </div>
              {comment.children && comment.children.length > 0 && 
              <>
                {comment.children.map((comment)=>(
                  <CommentReplyItem key={comment.id} comment={comment}/>
                ))}
              </>
                 
              }

          </div>
      )
  }
  const CommentItem = ({comment}) =>{
    console.log(comment)
    console.log(comment.user)

    const [showReply,setShowReply] = useState(false)
    const [activeReplying,setActiveReplying] = useState(false)
    const commentData = {
        id:comment.id,
        likeCount: comment.likeCount || 0,
        liked:comment.liked || false
    }
      const onReplyClick = (commentId)=>{
        setReplyPrefix(`@${comment.user}: `)
        setIsReplying(true)
        setActiveReplying(!activeReplying)
        setParentId(commentId)
      }
      return (

          <div className="comment-container"  key={comment.id} >
              <div className='comment-container-row'>
                  <div className="comment-container-col">
                    <UserCircle size={32}/>
                  </div>
                  <div className="comment-container-col">
                      <h6>{<Link to={`/profile/${comment?.user_id}`}>{comment.user}</Link> || "Anonymous"}</h6>
                      <p>{comment.content}</p>
                      <div>
                        <button onClick={()=>onReplyClick(comment.id)}className='reply-btn'>{activeReplying ? 'Cancel':'Reply'}</button>
                        {
                        comment.children && comment.children.length > 0 && 
                        <button className='reply-btn' onClick={()=>setShowReply(!showReply)}>{showReply?
                        (<>
                          Hide <CaretUp size={16} weight="bold" style={{paddingTop:'6px'}}/>
                        </>)
                        :
                        (<>
                        {comment.children.length} Repl{comment.children.length > 1? 'ies':'y'} <CaretDown size={16} weight="bold" style={{paddingTop:'6px'}} />
                        </>)}
                        </button>
                        }
                      </div>
                      
                  </div>
                  {/* <div className="comment-container-col">
                      <LikeCommentButton commentData={commentData}/>
                  </div> */}
              </div>
              {comment.children && comment.children.length > 0 &&
              <div>
                {showReply && 
                <div className='comment-reply-container'>
                  {comment.children.map((child) => {
                    const tagged_user = child.subParent?.[0]?.user || null;
                    return (
                      <CommentReplyItem key={child.id} comment={child} taggedUser={tagged_user} />
                    );
                  })}
                </div>
                }
              </div>
              }

          </div>
      )
  }

  const CommentBox = () => {
    return (
      <div className='comment-box-container'>
        {commentTree.map((comment) => {
          return <CommentItem key={comment.id} comment={comment} />;
        })}
      </div>
    );
  };

  return (
    <div className='comment-section-container'>
    <div className='input-box-container'>
      <InputBox/>
    </div>
    {isLoading && <div>Loading Comments ...</div>}
    <CommentBox key={postId}/>
    {/* {showDiv && <LoginPromptModal onClose={() => setShowDiv(false)} />} */}
    </div>
  )
}
