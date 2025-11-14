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
import { fetchMyProfile } from '../../api/users';

export default function Profile({ onNavigate }) {
  const [profileImage, setProfileImage] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  // 1) 로컬스토리지에 저장된 프로필 이미지 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('userProfileImage');
    if (stored) setProfileImage(stored);
  }, []);

  // 2) 서버에서 내 프로필 불러오기 /users/me/
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { ok, data } = await fetchMyProfile();
        if (ok) {
          setMyProfile(data);
        } else {
          console.error('내 프로필 조회 실패', data);
        }
      } catch (err) {
        console.error('내 프로필 조회 중 에러', err);
      }
    };

    loadProfile();
  }, []);

  // 3) 로그인 시 저장해 둔 아이디 / 닉네임 불러오기
  const storedUserId = localStorage.getItem('user_id');     // Login.jsx에서 set한 값
  const storedNickname = localStorage.getItem('nickname');  // Login.jsx에서 set한 값

  // 4) 최종 user 객체 만들기 (우선순위: 서버 -> 로컬스토리지 -> mockData)
  const user = {
    ...currentUser,
    id: myProfile?.id ?? currentUser.id,
    username:
      myProfile?.user_id ??
      myProfile?.username ??
      storedUserId ??
      currentUser.username,
    displayName:
      myProfile?.nickname ??
      storedNickname ??
      currentUser.displayName,
    profileImage,
  };

  // 아래는 기존 mock 통계 로직 그대로 유지
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
    // TODO: 나중에 진짜 로그아웃 연결
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
