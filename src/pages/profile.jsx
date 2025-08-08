import { useNavigate, useParams } from "react-router-dom";
import { ActivitySection } from "../components/activitySection";
import { ProfileHeader } from "../components/profileHeader";
import { auth } from "../config/firebase-config";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/navbar";

export const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [uid, setUid] = useState(null);
  const { fetchUserDataByUID } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentUID = user?.uid;
      const targetId = id ?? currentUID;

      if (!targetId || !isMounted) return;

      const userData = await fetchUserDataByUID(targetId);
      if (userData && isMounted) {
        setUserData(userData.data);
        setUid(targetId); // ✅ now uid is guaranteed to be set
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [id, fetchUserDataByUID]);

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <ProfileHeader data={userData} />
          {uid ? <ActivitySection uid={uid} /> : <p>Loading...</p>}
        </div>
      </div>
    </>
  );
};
