import { Calendar, MapPin, MessengerLogo, UserCircle } from "phosphor-react";
import "../css/profile.css"; // Make sure this is correctly imported


export function ProfileHeader({data}) {
  return (
    <div className="profile-card">
      <div className="profile-card-content">
        <div className="profile-layout">
          {/* Avatar */}
          <div className="profile-avatar">
            {/* <img src={user.avatar} alt={user.name} className="avatar-img" /> */}
            <UserCircle size={42}/>
          </div>

          {/* User Info */}
          <div className="profile-info">
            <h1 className="profile-name">{data.name}</h1>
            <p className="profile-bio">{data.bio}</p>

            <div className="profile-meta">
              <div className="meta-item">
                <MessengerLogo size={16} />
                <span>{data.email}</span>
              </div>
              <div className="meta-item">
                <MapPin size={16} />
                <span>{data.location ?? 'New Delhi'}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Joined {data.joinedDate ?? "now"}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-box">
                <div className="stat-number">{data.postsCount ?? 0}</div>
                <div className="stat-label">Posts</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{data.followersCount ?? 0}</div>
                <div className="stat-label">Followers</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{data.followingCount ?? 0}</div>
                <div className="stat-label">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
