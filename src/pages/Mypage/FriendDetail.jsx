// src/pages/Mypage/FriendDetail.jsx

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import '../../components/Navbar.css';

import {
  friends as mockFriends,
  rooms,
  letters as mockLetters,
  currentUser,
} from '../../utils/mockData';

import '../../components/mypage/FriendDetail.css';

// 아이콘 SVG
import userIcon from '../../assets/icons/user.svg';
import penIcon from '../../assets/icons/pen-line.svg';
import userMinusIcon from '../../assets/icons/user-minus.svg';

export default function FriendDetail({ friendId, onNavigate, onBack }) {
  // friendId 로 친구 정보 찾기
  const friendship = mockFriends.find((f) => f.friend.id === friendId);
  const friend = friendship?.friend;

  // 친구 못 찾았을 때
  if (!friend) {
    return (
      <div className="friend-detail-page">
        <Header onNavigate={onNavigate} />
        <div className="friend-detail-inner">
          <p className="friend-detail-not-found">친구를 찾을 수 없어요.</p>
          <button
            className="friend-detail-back-btn-only"
            onClick={() => onNavigate && onNavigate('friend-management')}
          >
            목록으로 돌아가기
          </button>
        </div>
        <Navbar currentPage="profile" onNavigate={onNavigate} />

      </div>
    );
  }

  // ====== 간단한 통계 ======

  // 공개된 편지방: 친구가 만든 public 방
  const publicRooms = rooms.filter(
    (r) => r.visibility === 'public' && r.hostId === friend.id,
  );

  // 내가 친구에게 보낸 편지
  const myLettersToFriend = mockLetters.filter(
    (l) => l.senderId === currentUser.id && l.receiverId === friend.id,
  );

  // 친구가 나에게 보낸 편지
  const friendLettersToMe = mockLetters.filter(
    (l) => l.senderId === friend.id && l.receiverId === currentUser.id,
  );

  // ====== 버튼 동작 ======

  const handleBack = () => {
    if (onBack) onBack();
    else onNavigate && onNavigate('friend-management');
  };

  const handleWriteLetter = () => {
    alert('편지 쓰기 기능은 나중에 연결할 예정이에요! ✉️');
    // 나중에: onNavigate('compose', { receiverId: friend.id });
  };

  const handleDeleteFriend = () => {
    const ok = window.confirm(
      `${friend.displayName}님과의 친구 관계를 해제하시겠어요?\n(지금은 UI만 동작하고 실제 데이터는 안 지워져요)`
    );
    if (오케이) {
      alert('친구 삭제가 처리되었다고 가정할게요!');
      onNavigate && onNavigate('friend-management');
    }
  };

  return (
    <div className="friend-detail-page">
      <Header onNavigate={onNavigate} />

      <div className="friend-detail-inner">
        {/* 상단 돌아가기 버튼 */}
        <button className="friend-detail-back" onClick={handleBack}>
          <span className="friend-detail-back-arrow">←</span>
          <span className="friend-detail-back-text">돌아가기</span>
        </button>

        {/* 친구 프로필 카드 */}
        <section className="friend-detail-card">
          <div className="friend-detail-profile">
            <div className="friend-detail-avatar">
              <img src={userIcon} alt="user" />
            </div>
            <h2 className="friend-detail-name">{friend.displayName}</h2>
            <p className="friend-detail-id">@{friend.username}</p>
          </div>

          <div className="friend-detail-actions">
            <button
              className="friend-detail-btn friend-detail-btn-primary"
              onClick={handleWriteLetter}
            >
              <img src={penIcon} alt="" className="friend-detail-btn-icon" />
              <span>편지 쓰기</span>
            </button>
            <button
              className="friend-detail-btn friend-detail-btn-outline"
              onClick={handleDeleteFriend}
            >
              <img
                src={userMinusIcon}
                alt=""
                className="friend-detail-btn-icon"
              />
              <span>친구 삭제</span>
            </button>
          </div>
        </section>

        <hr className="friend-detail-divider" />

        {/* 공개된 편지방 섹션 */}
        <section className="friend-detail-section">
          <div className="friend-detail-section-header">
            <div className="friend-detail-section-icon friend-detail-section-icon-red">
              <span className="friend-detail-section-icon-text">✉</span>
            </div>
            <div>
              <h3 className="friend-detail-section-title">공개된 편지방</h3>
              <p className="friend-detail-section-sub">
                {publicRooms.length}개의 편지방
              </p>
            </div>
          </div>

          {publicRooms.length === 0 ? (
            <div className="friend-detail-empty-card">
              <div className="friend-detail-empty-circle">✉</div>
              <p className="friend-detail-empty-text">
                공개된 편지방이 없어요.
              </p>
              <p className="friend-detail-empty-sub">
                함께 편지방을 만들어보세요!
              </p>
            </div>
          ) : (
            <div className="friend-detail-info-box">
              함께 만든 공개 편지방이 {publicRooms.length}개 있어요.
            </div>
          )}
        </section>

        <hr className="friend-detail-divider" />

        {/* 내가 보낸 편지 섹션 */}
        <section className="friend-detail-section">
          <div className="friend-detail-section-header">
            <div className="friend-detail-section-icon friend-detail-section-icon-pink">
              <span className="friend-detail-section-icon-text">➜</span>
            </div>
            <div>
              <h3 className="friend-detail-section-title">내가 보낸 편지</h3>
              <p className="friend-detail-section-sub">
                {myLettersToFriend.length}개의 편지
              </p>
            </div>
          </div>

          {myLettersToFriend.length === 0 ? (
            <div className="friend-detail-empty-card">
              <div className="friend-detail-empty-circle">✉</div>
              <p className="friend-detail-empty-text">
                아직 작성한 편지가 없어요.
              </p>
              <p className="friend-detail-empty-sub">
                첫 편지로 마음을 전해보세요 ✉️
              </p>
              <button
                className="friend-detail-small-primary"
                onClick={handleWriteLetter}
              >
                첫 편지 쓰기
              </button>
            </div>
          ) : (
            <div className="friend-detail-info-box">
              지금까지 {myLettersToFriend.length}개의 편지를 보냈어요.
            </div>
          )}
        </section>

        <hr className="friend-detail-divider" />

        {/* 친구에게 받은 편지 섹션 */}
        <section className="friend-detail-section">
          <div className="friend-detail-section-header">
            <div className="friend-detail-section-icon friend-detail-section-icon-peach">
              <span className="friend-detail-section-icon-text">❤</span>
            </div>
            <div>
              <h3 className="friend-detail-section-title">
                친구에게 받은 편지
              </h3>
              <p className="friend-detail-section-sub">
                {friendLettersToMe.length}개의 편지
              </p>
            </div>
          </div>

          {friendLettersToMe.length === 0 ? (
            <div className="friend-detail-empty-card">
              <div className="friend-detail-empty-circle">✉</div>
              <p className="friend-detail-empty-text">
                아직 받은 편지가 없어요.
              </p>
              <p className="friend-detail-empty-sub">
                친구의 따뜻한 편지를 기다려보세요 💌
              </p>
            </div>
          ) : (
            <div className="friend-detail-info-box">
              친구에게서 {friendLettersToMe.length}개의 편지를 받았어요.
            </div>
          )}
        </section>
      </div>

      {/* 하단 탭바 (마이페이지 강조) */}
      <BottomTabBar currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}