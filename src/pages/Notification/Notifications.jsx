// src/pages/Notification/Notifications.jsx
import { useEffect, useState } from "react";
import "./Notifications.css";

// 아이콘들
import userPlusIcon from "../../assets/icons/user-plus.svg";
import mailIcon from "../../assets/icons/mail.svg";

import {
  getNotifications,
  markNotificationRead,
} from "../../api/notifications";

export default function Notifications({ onNavigate, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("profile");
  };

  // ===============================
  // 7일 이내 알림만 필터링
  // ===============================
  const filterRecent = (list) => {
    const now = new Date();
    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000
    ); // 7일 전

    return list.filter((n) => {
      if (!n.createdAt) return true; // createdAt 없으면 그냥 보여줌
      const created = new Date(n.createdAt);
      if (Number.isNaN(created.getTime())) return true;
      return created >= sevenDaysAgo;
    });
  };

  // ===============================
  // 알림 목록 불러오기
  // ===============================
  const loadNotifications = async () => {
    setLoading(true);
    const { ok, data } = await getNotifications();

    if (!ok) {
      alert("알림을 불러오지 못했어요.");
      setLoading(false);
      return;
    }

    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
      ? data.results
      : [];

    const mapped = rawList.map((n) => ({
      id: n.id,
      type: n.type, // 'friend_request', 'new_letter' 등
      title: n.title,
      message: n.message,
      createdAt: n.created_at || n.createdAt,
      isRead: n.is_read ?? false,
    }));

    setNotifications(filterRecent(mapped));
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ===============================
  // 아이콘 리턴
  // ===============================
  const getNotificationIcon = (type) => {
    if (type === "friend_request") {
      return (
        <img
          src={userPlusIcon}
          alt="친구 요청"
          className="noti-icon-img"
        />
      );
    }
    if (type === "new_letter") {
      return (
        <img src={mailIcon} alt="새 편지" className="noti-icon-img" />
      );
    }
    if (type === "room_invite")
      return <span className="noti-icon-emoji">🏠</span>;
    if (type === "dday_reminder")
      return <span className="noti-icon-emoji">📅</span>;
    if (type === "like") return <span className="noti-icon-emoji">❤️</span>;
    if (type === "comment")
      return <span className="noti-icon-emoji">💬</span>;
    return <span className="noti-icon-emoji">🔔</span>;
  };

  // ===============================
  // 카드 클릭 → 읽음 표시 + 페이지 이동
  // ===============================
  const handleNotificationClick = async (notification) => {
    // 이미 읽은 알림이어도 API는 한 번 더 보내도 상관 없음
    if (!notification.isRead) {
      const { ok } = await markNotificationRead(notification.id);
      if (ok) {
        // 로컬 상태 업데이트 (읽음 표시)
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      }
    }

    if (!onNavigate) return;

    if (notification.type === "friend_request") {
      onNavigate("friend-management");
    }
    // TODO: 다른 타입들 필요하면 여기 추가
  };

  return (
    <div className="notifications-page">
      <div className="notifications-inner">
        {/* 상단 노란 헤더 */}
        <div className="notifications-header">
          <div className="notifications-header-inner">
            <button
              type="button"
              className="notifications-back-btn"
              onClick={handleBack}
            >
              ←
            </button>
            <h1 className="notifications-title">알림</h1>
          </div>
        </div>

        {/* 알림 리스트 */}
        <div className="notifications-list">
          {loading ? (
            <div className="notifications-empty">
              <div className="notifications-empty-circle">
                <span className="notifications-empty-bell">🔔</span>
              </div>
              <p className="notifications-empty-text">
                알림을 불러오는 중입니다...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="notifications-empty-circle">
                <span className="notifications-empty-bell">🔔</span>
              </div>
              <p className="notifications-empty-text">알림이 없어요</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={
                  "notification-card" +
                  (notification.isRead ? " notification-card-read" : "")
                }
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-card-inner">
                  <div className="notification-icon-circle">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-texts">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    {/* createdAt 포맷팅은 필요하면 나중에 함수로 빼도 됨 */}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* 하단 안내 문구 */}
        {!loading && notifications.length > 0 && (
          <div className="notifications-hint">
            💡 알림은 7일 후 자동으로 삭제됩니다
          </div>
        )}
      </div>
    </div>
  );
}
