// src/components/mypage/ProfileCard.jsx
import './Mypage.css';
import userIcon from '../../assets/icons/user.svg';
import { getCurrentUserNickname } from '../../utils/userInfo.js';

export default function ProfileCard({ user, onEditProfile, onFriendManage }) {
  return (
    <section className="profile-card">
      <div className="profile-image">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="profile"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <img src={userIcon} alt="default user" width="40" />
        )}
      </div>

      <h1 className="profile-name">{user?.displayName || getCurrentUserNickname()}</h1>
      <p className="profile-username">@{user?.username || 'myusername'}</p>

      <button onClick={onEditProfile} className="profile-btn">
        ⚙️ 프로필 편집
      </button>

      <button onClick={onFriendManage} className="profile-btn">
        👥 친구 관리
      </button>
    </section>
  );
}
