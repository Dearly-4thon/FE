// src/components/mypage/ProfileCard.jsx
import './Mypage.css';
import userIcon from '../../assets/icons/user.svg';

export default function ProfileCard({ user, onEditProfile, onFriendManage }) {
  return (
    <section className="profile-card">
      {/* 프로필 이미지 */}
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

      {/* 닉네임 (백엔드: nickname) */}
      <h1 className="profile-name">
        {user?.displayName || user?.nickname || '디어리'}
      </h1>

      {/* 아이디 (백엔드: user_id → username에 매핑됨) */}
      <p className="profile-username">
        @{user?.username || user?.user_id || 'myusername'}
      </p>

      {/* 버튼들 */}
      <button onClick={onEditProfile} className="profile-btn">
        ⚙️ 프로필 편집
      </button>

      <button onClick={onFriendManage} className="profile-btn">
        👥 친구 관리
      </button>
    </section>
  );
}
