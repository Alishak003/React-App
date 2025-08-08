import { useParams } from "react-router-dom";
import { CommentComponent } from "../components/CommentSection";
import Navbar from "../components/navbar";

export const Comments=()=>{
    const {postId} = useParams()
    return(
        <>
        <Navbar/>
        <CommentComponent postId={postId}/>

        </>
    )
}