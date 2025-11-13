// src/pages/Mypage/Profile.jsx
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import '../../components/Navbar.css';
import ProfileCard from '../../components/mypage/ProfileCard';
import {
  rooms,
  letters as mockLetters,
  currentUser,
  friends as mockFriends,
} from '../../utils/mockData';

import '../../components/mypage/Mypage.css';
import megaphoneIcon from '../../assets/icons/megaphone.svg'; // 공지 아이콘

export default function Profile({ onNavigate }) {
  const [profileImage, setProfileImage] = useState(null);

  // 로컬스토리지에 저장된 프로필 이미지 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('userProfileImage');
    if (stored) setProfileImage(stored);
  }, []);

  const user = { ...currentUser, profileImage };

  const friendCount = mockFriends.filter((f) => f.status === 'accepted').length;
  const publicRooms = rooms.filter(
    (r) => r.hostId === currentUser.id && r.visibility === 'public'
  );
  const sentLetters = mockLetters.filter(
    (l) => l.senderId === currentUser.id
  );
  const receivedLetters = mockLetters.filter(
    (l) => l.receiverId === currentUser.id
  );

  const handleLogout = () => {
    // 진짜 로그아웃 로직은 나중에 연결
    alert('로그아웃 되었습니다 (데모 동작) 😊');
  };

  return (
    <div className="mypage-container">
      <Header onNavigate={onNavigate} />

      {/* 프로필 카드 */}
      <ProfileCard
        user={user}
        onEditProfile={() => onNavigate('edit-profile')}
        onFriendManage={() => onNavigate('friend-management')}
      />

      {/* 통계 카드 3개 */}
      <div className="stats-container">
        <div className="stats-card">
          <div className="stats-icon" style={{ backgroundColor: '#E5EEFF' }}>
            🏠
          </div>
          <div className="stats-number">{publicRooms.length}</div>
          <div className="stats-label">공개 편지방</div>
        </div>

        <div className="stats-card">
          <div className="stats-icon" style={{ backgroundColor: '#FFE5E5' }}>
            ✉️
          </div>
          <div className="stats-number">{sentLetters.length}</div>
          <div className="stats-label">작성한 편지</div>
        </div>

        <div className="stats-card">
          <div className="stats-icon" style={{ backgroundColor: '#FFF3CC' }}>
            📥
          </div>
          <div className="stats-number">{receivedLetters.length}</div>
          <div className="stats-label">받은 편지</div>
        </div>
      </div>

      {/* 친구 수 텍스트 */}
      <p
        style={{
          color: '#9B8579',
          fontSize: '12px',
          marginTop: '12px',
        }}
      >
        지금까지{' '}
        <b style={{ color: '#4A3428' }}>{friendCount}</b>
        명의 친구와 함께하고 있어요.
      </p>

      {/* === 공지사항 버튼 (긴 탭) === */}
      <div className="notice-section">
        <button
          type="button"
          className="notice-button"
          onClick={() => onNavigate('notices')}
        >
          <span className="notice-icon">
            <img src={megaphoneIcon} alt="공지" />
          </span>
          <span>공지사항</span>
        </button>
      </div>

      {/* === 로그아웃 버튼 (긴 탭) === */}
      <div className="logout-section">
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          ↪ 로그아웃
        </button>
      </div>

      <Navbar currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}
