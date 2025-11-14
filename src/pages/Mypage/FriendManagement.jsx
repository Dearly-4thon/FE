// src/pages/Mypage/FriendManagement.jsx

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import "../../components/mypage/FriendManagement.css";

import userIcon from "../../assets/icons/user.svg";
import userPlusIcon from "../../assets/icons/user-plus.svg";
import usersIcon from "../../assets/icons/users.svg";
import searchIcon from "../../assets/icons/search.svg";
import checkIcon from "../../assets/icons/check.svg";
import xIcon from "../../assets/icons/x.svg";

// 📌 API
import {
  getFriends,
  getReceivedFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  toggleFriendFavorite,
  deleteFriend,
  searchFriends,
  sendFriendRequest,
} from "../../api/friends";

export default function FriendManagement({ onNavigate, onBack }) {
  const [activeTab, setActiveTab] = useState("add");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  // 서버 데이터
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [confirmState, setConfirmState] = useState(null);

  // ===============================
  // 📌 1) 내 친구 목록 로드
  // ===============================
  const loadFriends = async () => {
    const { ok, data } = await getFriends();
    if (ok) {
      setFriends(
        data.map((f) => ({
          id: f.id,
          friendId: f.friend.id,
          displayName: f.friend.nickname,
          username: f.friend.user_id,
          isPinned: f.is_favorite ?? false,
        }))
      );
    }
  };

  // ===============================
  // 📌 2) 받은 친구 요청
  // ===============================
  const loadPending = async () => {
    const { ok, data } = await getReceivedFriendRequests();
    if (ok) {
      setPendingRequests(
        data.map((req) => ({
          id: req.id,
          friendId: req.sender.id,
          displayName: req.sender.nickname,
          username: req.sender.user_id,
        }))
      );
    }
  };

  useEffect(() => {
    loadFriends();
    loadPending();
  }, []);

  // ===============================
  // 📌 즐겨찾기 토글
  // ===============================
  const handleTogglePin = async (friendshipId, friendId) => {
    const { ok } = await toggleFriendFavorite(friendId);
    if (!ok) return alert("즐겨찾기 변경 실패!");

    setFriends((prev) =>
      prev.map((f) =>
        f.id === friendshipId ? { ...f, isPinned: !f.isPinned } : f
      )
    );
  };

  // ===============================
  // 📌 친구 요청 수락/거절
  // ===============================
  const handleConfirm = async () => {
    const { type, friend } = confirmState;

    if (type === "accept") {
      const { ok } = await acceptFriendRequest(friend.id);
      if (!ok) return alert("수락 실패!");

      await loadFriends();
      await loadPending();
      alert("새로운 친구가 되었어요! 🎉");
    } else {
      const { ok } = await rejectFriendRequest(friend.id);
      if (!ok) return alert("거절 실패!");

      await loadPending();
      alert("친구 요청을 거절했어요.");
    }

    setConfirmState(null);
  };

  // ===============================
  // 📌 친구 삭제
  // ===============================
  const handleDeleteFriend = async (friendshipId) => {
    const { ok } = await deleteFriend(friendshipId);
    if (!ok) return alert("삭제 실패!");

    setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
  };

  // ===============================
  // 📌 친구 검색 (q=아이디 또는 닉네임)
  // ===============================
  const handleSearch = async () => {
    if (!friendSearchQuery.trim()) return;

    const res = await searchFriends(friendSearchQuery);

    if (!res.ok || !Array.isArray(res.data)) {
      setSearchResults([]);
      return;
    }

    setSearchResults(
      res.data.map((u) => ({
        id: u.id,
        displayName: u.nickname,
        username: u.user_id,
      }))
    );
  };

  // ===============================
  // 📌 친구 요청 보내기
  // ===============================
  const handleAddFriend = async (user) => {
    const { ok } = await sendFriendRequest({ receiver_id: user.id });
    if (ok) alert(`${user.displayName}님에게 친구 요청을 보냈어요! 💌`);
    else alert("친구 요청 실패!");
  };

  // ===============================
  // 📌 정렬
  // ===============================
  const sortedFriends = [...friends].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.displayName.localeCompare(b.displayName, "ko-KR");
  });

  const handleBack = () => {
    if (onBack) onBack();
    else onNavigate("profile");
  };

  return (
    <div className="friend-page">
      <Header onNavigate={onNavigate} />

      <div className="friend-inner">
        {/* 헤더 */}
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
            <p>⭐ 즐겨찾은 친구는 메인 화면에 고정돼요!</p>
            <div className="friend-guide-badge">
              현재 {friends.filter((f) => f.isPinned).length}/10명 고정
            </div>
          </div>
        )}

        {/* 탭 */}
        <div className="friend-tabs">
          <button
            className={`friend-tab-btn ${
              activeTab === "add" ? "friend-tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab("add")}
          >
            <img src={userPlusIcon} className="friend-tab-icon" />
            아이디 검색
          </button>

          <button
            className={`friend-tab-btn ${
              activeTab === "find" ? "friend-tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab("find")}
          >
            <img src={usersIcon} className="friend-tab-icon" />
            친구 검색
          </button>
        </div>

        {/* ============================
            탭 1) 아이디 검색
        ============================ */}
        {activeTab === "add" && (
          <div className="friend-tab-panel">
            {/* 친구 요청 */}
            {pendingRequests.length > 0 && (
              <section className="friend-section">
                <div className="friend-section-header">
                  <span className="friend-section-title">친구 요청</span>
                  <span className="friend-section-sub">
                    받은 요청 {pendingRequests.length}건
                  </span>
                </div>

                <div className="friend-list">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="friend-card">
                      <div className="friend-card-main">
                        <div className="friend-avatar">
                          <img src={userIcon} className="friend-avatar-icon" />
                        </div>
                        <div>
                          <div className="friend-name">{req.displayName}</div>
                          <div className="friend-id">@{req.username}</div>
                        </div>
                      </div>

                      <div className="friend-card-actions">
                        <button
                          className="friend-round-btn friend-round-btn-blue"
                          onClick={() =>
                            setConfirmState({ type: "accept", friend: req })
                          }
                        >
                          <img src={checkIcon} />
                        </button>

                        <button
                          className="friend-round-btn friend-round-btn-outline"
                          onClick={() =>
                            setConfirmState({ type: "reject", friend: req })
                          }
                        >
                          <img src={xIcon} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 검색창 */}
            <div className="friend-search">
              <img src={searchIcon} className="friend-search-icon" />
              <input
                type="text"
                placeholder="아이디 또는 닉네임 검색"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* 검색 결과 */}
            {friendSearchQuery.trim() && searchResults.length === 0 ? (
              <div className="friend-empty-card">
                <div className="friend-empty-circle">
                  <img src={userPlusIcon} />
                </div>
                <p>검색 결과가 없어요.</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="friend-list">
                {searchResults.map((user) => (
                  <div key={user.id} className="friend-card">
                    <div className="friend-card-main">
                      <div className="friend-avatar">
                        <img src={userIcon} className="friend-avatar-icon" />
                      </div>
                      <div>
                        <div className="friend-name">{user.displayName}</div>
                        <div className="friend-id">@{user.username}</div>
                      </div>
                    </div>

                    <button
                      className="friend-round-btn friend-round-btn-blue"
                      onClick={() => handleAddFriend(user)}
                    >
                      친구 요청
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="friend-empty-card">
                <div className="friend-empty-circle">
                  <img src={userPlusIcon} />
                </div>
                <p>아이디로 친구를 검색해보세요.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================
            탭 2) 친구 목록
        ============================ */}
        {activeTab === "find" && (
          <div className="friend-tab-panel">
            <div className="friend-search">
              <img src={searchIcon} className="friend-search-icon" />
              <input
                type="text"
                placeholder="친구 이름 또는 @아이디 검색"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
              />
            </div>

            {sortedFriends.length > 0 ? (
              <div className="friend-list">
                {sortedFriends
                  .filter(
                    (f) =>
                      f.displayName
                        .toLowerCase()
                        .includes(friendSearchQuery.toLowerCase()) ||
                      f.username
                        .toLowerCase()
                        .includes(friendSearchQuery.toLowerCase())
                  )
                  .map((f) => (
                    <div
                      key={f.id}
                      className="friend-card"
                      onClick={() =>
                        onNavigate("friend-detail", { friendId: f.friendId })
                      }
                    >
                      <div className="friend-card-main">
                        <div className="friend-avatar">
                          <img src={userIcon} className="friend-avatar-icon" />
                        </div>
                        <div>
                          <div className="friend-name">{f.displayName}</div>
                          <div className="friend-id">@{f.username}</div>
                        </div>
                      </div>

                      <div className="friend-card-actions">
                        <button
                          className={`friend-star-btn ${
                            f.isPinned ? "friend-star-btn-active" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(f.id, f.friendId);
                          }}
                        >
                          ★
                        </button>

                        <button
                          className="friend-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFriend(f.id);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="friend-empty-card">
                <div className="friend-empty-circle">
                  <img src={usersIcon} />
                </div>
                <p>친구가 아직 없어요.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 모달 */}
      {confirmState && (
        <div className="friend-modal-backdrop">
          <div className="friend-modal">
            <h2 className="friend-modal-title">
              {confirmState.type === "accept" ? "친구 수락" : "친구 거절"}
            </h2>
            <p className="friend-modal-text">
              {confirmState.friend.displayName}님을{" "}
              {confirmState.type === "accept"
                ? "친구로 추가할까요?"
                : "거절할까요?"}
            </p>

            <div className="friend-modal-actions">
              <button
                className="friend-modal-btn friend-modal-btn-cancel"
                onClick={() => setConfirmState(null)}
              >
                취소
              </button>

              <button
                className={`friend-modal-btn ${
                  confirmState.type === "accept"
                    ? "friend-modal-btn-blue"
                    : "friend-modal-btn-red"
                }`}
                onClick={handleConfirm}
              >
                {confirmState.type === "accept" ? "수락" : "거절"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
