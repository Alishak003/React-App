import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import { logout } from "../services/authService"
import { auth } from "../config/firebase-config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
const Navbar = () => {
  const navigate = useNavigate();
  const [userId,setUserId] = useState(null)

  useEffect(()=>{
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
               setUserId(user.uid)
               console.log("user : ",user.uid)
          })
          return()=>unsubscribe()
  },[])
  const handleLogout = () => {
    logout();
    navigate('/')
  };
  return (
    <nav className="navbar">
      <div style={{display:'flex',justifyContent:'center',marginLeft:'2rem'}}>
      <h2 className="nav-logo">MiniLinkedIn</h2>

        <ul className="nav-links">
          <li><Link to="/feed">Feed</Link></li>
          <li><Link to={`/profile/${userId}`}>{userId? 'Profile' : ''}</Link></li>
        </ul>
      </div>
{userId && 
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
}
{!userId && 
        <button className="logout-btn" onClick={()=>navigate('/')}>Log In</button>
}
    </nav>
  );
};

export default Navbar;
