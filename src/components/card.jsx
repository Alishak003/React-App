import { formatDistanceToNow } from "date-fns"; 
import { DotsThreeOutlineVertical, PencilSimple, Trash, UserCircle } from "phosphor-react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../config/firebase-config"
import { LikeButton } from "./LikeButton";
import "../css/card.css"
import CommentButton from "./CommentButton";
export const Card = ({data})=>{

  let formattedTime = "";
  if (data.created_at) {
    const date = data.created_at.toDate(); 
    formattedTime = formatDistanceToNow(date, { addSuffix: true }); 
  }
  console.log(data)
    const user = auth.currentUser?.uid
    const handleComment = (postId)=>{
    navigate(`/comments/${postId}`)
  }
 
    const handleDelete = ()=>{

    }

    const navigate = useNavigate()

    return(
        <div className="post_card" key={data.id} >
                  <div className="profile_container">
                      <div className="profile-photo">
                          <UserCircle size={22}/>
                      </div>
                      <Link className="" to={`/profile/${data.user?.uid}`}>{data.user?.name}</Link>
                      <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "gray" }}>
                        {formattedTime}
                      </span>
                      {user === data.user_id && (
                        <div className="menu-wrapper" style={{ position: "relative" }}>
                          <button className="post_menu_btn">
                            <DotsThreeOutlineVertical size={22} />
                          </button>

                          {/* {data.id && (
                            <div
                              className="post-menu-dropdown"
                              style={{
                                position: "absolute",
                                top: "30px",
                                right: '-150px',
                                zIndex: 10
                              }}
                            >
                              <button onClick={()=>{navigate(`/post/edit/${data.id}`)}}><PencilSimple size={20} /> Edit</button>
                              <button onClick={() => handleDelete(data.id)} className='post_delete_btn'><Trash size={20} /> Delete</button>
                            </div>
                          )} */}
                        </div>
                      )}
                  </div>
                  {data.content?(
                    <div className="text_continer">
                        <p>{data.content}</p>
                    </div>
                  ):''}
                  <div className="btn_container">
                      <LikeButton postId={data.id} />
                     <CommentButton postId={data.id} onClick={()=>{handleComment(data.id)}}/>
                     {/* <ShareButton postId={data.id}/> */}
                  </div>
              </div>
    )
}