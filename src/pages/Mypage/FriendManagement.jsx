// src/pages/Mypage/FriendManagement.jsx

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { friends as mockFriends } from '../../utils/mockData';
import '../../components/mypage/FriendManagement.css';

// 아이콘들
import userIcon from '../../assets/icons/user.svg';
import userPlusIcon from '../../assets/icons/user-plus.svg';
import usersIcon from '../../assets/icons/users.svg';
import searchIcon from '../../assets/icons/search.svg';
import checkIcon from '../../assets/icons/check.svg';
import xIcon from '../../assets/icons/x.svg';

export default function FriendManagement({ onNavigate, onBack }) {
  // 탭: add(아이디 검색) / find(친구 검색)
  const [activeTab, setActiveTab] = useState('add');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [friends, setFriends] = useState(mockFriends);

  // 확인 모달 (수락 / 거절)
  // confirmState = { type: 'accept' | 'reject', friend }
  const [confirmState, setConfirmState] = useState(null);

  // 고정친구(즐겨찾기)
  const [pinnedFriends, setPinnedFriends] = useState(() => {
    const stored = localStorage.getItem('pinnedFriends');
    if (stored) return new Set(JSON.parse(stored));
    return new Set(mockFriends.filter((f) => f.isPinned).map((f) => f.id));
  });

  useEffect(() => {
    localStorage.setItem('pinnedFriends', JSON.stringify(Array.from(pinnedFriends)));
  }, [pinnedFriends]);

  const pendingFriends = friends.filter((f) => f.status === 'pending');
  const acceptedFriends = friends.filter((f) => f.status === 'accepted');

  const handleBack = () => {
    if (onBack) onBack();
    else onNavigate && onNavigate('profile');
  };

  const openConfirm = (type, friendship) => {
    setConfirmState({ type, friend: friendship });
  };

  const handleConfirm = () => {
    if (!confirmState) return;
    const { type, friend } = confirmState;

    if (type === 'accept') {
      setFriends((prev) =>
        prev.map((f) => (f.id === friend.id ? { ...f, status: 'accepted' } : f)),
      );
      alert('새로운 친구가 되었어요! 🎉');
    } else {
      setFriends((prev) => prev.filter((f) => f.id !== friend.id));
      alert('친구 요청을 거절했어요');
    }
    setConfirmState(null);
  };

  const handleTogglePin = (friendshipId) => {
    setPinnedFriends((prev) => {
      const copy = new Set(prev);
      if (copy.has(friendshipId)) {
        copy.delete(friendshipId);
      } else {
        if (copy.size >= 10) {
          alert('즐겨찾기는 최대 10명까지만 가능해요 ⭐');
          return prev;
        }
        copy.add(friendshipId);
      }
      return copy;
    });
  };

  // 아이디 검색 탭에서 “친구 추가” 버튼 눌렀을 때
  const handleAddFriend = (name) => {
    alert(`${name}님에게 친구 요청을 보냈어요! 💌 (지금은 UI용 동작이에요)`);
  };

  // ======================
  //   검색 + 정렬 로직
  // ======================

  // 검색 필터
  const filteredAcceptedFriends = acceptedFriends.filter(
    (f) =>
      f.friend.displayName.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
      f.friend.username.toLowerCase().includes(friendSearchQuery.toLowerCase()),
  );

  // ⭐ 즐겨찾기 먼저, 그다음 이름 순
  const sortedFriends = [...filteredAcceptedFriends].sort((a, b) => {
    const aPinned = pinnedFriends.has(a.id);
    const bPinned = pinnedFriends.has(b.id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return a.friend.displayName.localeCompare(b.friend.displayName, 'ko-KR');
  });

  return (
    <div className="friend-page">
      <Header onNavigate={onNavigate} />

      <div className="friend-inner">
        {/* 상단 헤더 (뒤로가기 + 타이틀 + i 버튼) */}
        <div className="friend-top-row">
          <button className="friend-back-btn" onClick={handleBack}>
            ←
          </button>
          <h1 className="friend-title">친구 관리</h1>
          <button
            className="friend-info-dot"
            onClick={() => setShowGuide((prev) => !prev)}
          >
            i
          </button>
        </div>

        {showGuide && (
          <div className="friend-guide-box">
            <p>
              ⭐ 버튼을 눌러 친한 친구를 메인화면에 고정할 수 있어요!
              <br />
              고정된 친구는 메인화면에 나선형으로 표시됩니다.
            </p>
            <div className="friend-guide-badge">
              현재 {pinnedFriends.size}/12명 고정됨
            </div>
          </div>
        )}

        {/* 탭 버튼 */}
        <div className="friend-tabs">
          <button
            className={
              'friend-tab-btn ' + (activeTab === 'add' ? 'friend-tab-btn-active' : '')
            }
            onClick={() => setActiveTab('add')}
          >
            <img src={userPlusIcon} alt="" className="friend-tab-icon" />
            아이디 검색
          </button>
          <button
            className={
              'friend-tab-btn ' + (activeTab === 'find' ? 'friend-tab-btn-active' : '')
            }
            onClick={() => setActiveTab('find')}
          >
            <img src={usersIcon} alt="" className="friend-tab-icon" />
            친구 검색
          </button>
        </div>

        {/* 아이디 검색 탭 */}
        {activeTab === 'add' && (
          <div className="friend-tab-panel">
            {/* 친구 요청 영역 */}
            {pendingFriends.length > 0 && (
              <section className="friend-section">
                <div className="friend-section-header">
                  <span className="friend-section-title">친구 요청</span>
                  <span className="friend-section-sub">
                    받은 요청 {pendingFriends.length}건
                  </span>
                </div>

                <div className="friend-list">
                  {pendingFriends.map((friendship) => (
                    <div key={friendship.id} className="friend-card">
                      <div className="friend-card-main">
                        <div className="friend-avatar">
                          <img src={userIcon} alt="" className="friend-avatar-icon" />
                        </div>
                        <div>
                          <div className="friend-name">
                            {friendship.friend.displayName}
                          </div>
                          <div className="friend-id">@{friendship.friend.username}</div>
                        </div>
                      </div>

                      <div className="friend-card-actions">
                        <button
                          className="friend-round-btn friend-round-btn-blue"
                          onClick={() => openConfirm('accept', friendship)}
                        >
                          <img src={checkIcon} alt="수락" />
                        </button>
                        <button
                          className="friend-round-btn friend-round-btn-outline"
                          onClick={() => openConfirm('reject', friendship)}
                        >
                          <img src={xIcon} alt="거절" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 검색창 */}
            <div className="friend-search">
              <img src={searchIcon} alt="" className="friend-search-icon" />
              <input
                type="text"
                placeholder="아이디 또는 이름 검색"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
              />
            </div>

            {/* 실제 아이디 검색 결과는 아직 없으니, 피그마처럼 안내 박스만 */}
            <div className="friend-empty-card">
              <div className="friend-empty-circle">
                <img src={userPlusIcon} alt="" />
              </div>
              <p>아이디로 친구를 검색해보세요</p>
              <button
                className="friend-empty-add-btn"
                onClick={() => handleAddFriend('친구')}
              >
                예시로 친구 추가 버튼 눌러보기
              </button>
            </div>
          </div>
        )}

        {/* 친구 검색 탭 */}
        {activeTab === 'find' && (
          <div className="friend-tab-panel">
            {/* 검색창 */}
            <div className="friend-search">
              <img src={searchIcon} alt="" className="friend-search-icon" />
              <input
                type="text"
                placeholder="친구 이름 또는 @아이디 검색"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
              />
            </div>

            {/* 친구 리스트 */}
            {sortedFriends.length > 0 ? (
              <div className="friend-list">
                {sortedFriends.map((friendship) => {
                  const isPinned = pinnedFriends.has(friendship.id);
                  return (
                    <div
                      key={friendship.id}
                      className="friend-card"
                      onClick={() =>
                        onNavigate &&
                        onNavigate('friend-detail', {
                          friendId: friendship.friend.id,
                        })
                      }
                    >
                      <div className="friend-card-main">
                        <div className="friend-avatar">
                          <img src={userIcon} alt="" className="friend-avatar-icon" />
                        </div>
                        <div>
                          <div className="friend-name">
                            {friendship.friend.displayName}
                          </div>
                          <div className="friend-id">@{friendship.friend.username}</div>
                        </div>
                      </div>

                      <button
                        className={
                          'friend-star-btn ' +
                          (isPinned ? 'friend-star-btn-active' : '')
                        }
                        onClick={(e) => {
                          e.stopPropagation(); // 카드 클릭으로 페이지 이동 막기
                          handleTogglePin(friendship.id);
                        }}
                      >
                        ★
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="friend-empty-card">
                <div className="friend-empty-circle">
                  <img src={usersIcon} alt="" />
                </div>
                <p>아직 친구가 없어요</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 수락/거절 확인 모달 */}
      {confirmState && (
        <div className="friend-modal-backdrop">
          <div className="friend-modal">
            <h2 className="friend-modal-title">
              {confirmState.type === 'accept' ? '친구 수락' : '친구 거절'}
            </h2>
            <p className="friend-modal-text">
              {confirmState.friend.friend.displayName}님의 친구 요청을{' '}
              {confirmState.type === 'accept' ? '수락하시겠어요?' : '거절하시겠어요?'}
            </p>
            <div className="friend-modal-actions">
              <button
                className="friend-modal-btn friend-modal-btn-cancel"
                onClick={() => setConfirmState(null)}
              >
                취소
              </button>
              <button
                className={
                  'friend-modal-btn ' +
                  (confirmState.type === 'accept'
                    ? 'friend-modal-btn-blue'
                    : 'friend-modal-btn-red')
                }
                onClick={handleConfirm}
              >
                {confirmState.type === 'accept' ? '수락' : '거절'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
