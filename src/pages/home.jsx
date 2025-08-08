import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../css/home.css"
import { usePost } from "../hooks/usePost";
import {Card} from "../components/card";
import { Create } from "./create";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const Home  = ()=>{
    const {getPosts} = usePost();
    const [posts,setPosts] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const[user,setUser] = useState(null)
    useEffect(()=>{
        const getPostsList = async ()=>{
            const result = await getPosts();
            if(result.success){
                setPosts(result.data)
                console.log("posts",posts)
            }
            else{
                console.log(result.message)
            }
        }
        getPostsList()
    },[shouldRefresh])
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
             setUser(user)
        })
        return()=>unsubscribe()
    },[])
    return(
        <>
        <Navbar/>
        {user && <>
                <div className="create-post-container">
            <Create onPostCreated={() => setShouldRefresh(prev => !prev)}/>
        </div>
                <hr />
        </>

        }
            <div className="home-container">
                {posts.length?posts.map((post) => (
                    <Card key={post.id} data={post}  />
                )):
                <p>No Posts Yet </p>
                }
            </div>
        </>
        
    )
}
export default Home;