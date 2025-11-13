// src/pages/Notification/Notifications.jsx
import { useState } from 'react';
import './Notifications.css';

// 아이콘들
import userPlusIcon from '../../assets/icons/user-plus.svg';
import mailIcon from '../../assets/icons/mail.svg';

export default function Notifications({ onNavigate, onBack }) {
  const [notifications] = useState([
    {
      id: '1',
      type: 'friend_request',
      title: '새로운 친구 요청',
      message: '김친구님이 친구 요청을 보냈습니다',
      time: '5분 전',
    },
    {
      id: '2',
      type: 'new_letter',
      title: '새 편지가 도착했어요',
      message: '이친구님이 "생일 축하해요" 편지방에 편지를 남겼습니다',
      time: '1시간 전',
    },
    {
      id: '3',
      type: 'new_letter',
      title: '새 편지가 도착했어요',
      message: '최친구님이 "2025 새해 소망" 편지방에 편지를 남겼습니다',
      time: '2일 전',
    },
  ]);

  const handleBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate('profile');
  };

  const getNotificationIcon = (type) => {
    if (type === 'friend_request') {
      return <img src={userPlusIcon} alt="친구 요청" className="noti-icon-img" />;
    }
    if (type === 'new_letter') {
      return <img src={mailIcon} alt="새 편지" className="noti-icon-img" />;
    }
    // 나머지는 이모지로 간단히
    if (type === 'room_invite') return <span className="noti-icon-emoji">🏠</span>;
    if (type === 'dday_reminder') return <span className="noti-icon-emoji">📅</span>;
    if (type === 'like') return <span className="noti-icon-emoji">❤️</span>;
    if (type === 'comment') return <span className="noti-icon-emoji">💬</span>;
    return <span className="noti-icon-emoji">🔔</span>;
  };

  const handleNotificationClick = (notification) => {
    if (!onNavigate) return;

    if (notification.type === 'friend_request') {
      onNavigate('friend-management');
    }
    // 다른 타입들은 나중에 필요하면 추가!
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
          {notifications.length === 0 ? (
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
                className="notification-card"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-card-inner">
                  <div className="notification-icon-circle">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-texts">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* 하단 안내 문구 */}
        {notifications.length > 0 && (
          <div className="notifications-hint">
            💡 알림은 7일 후 자동으로 삭제됩니다
          </div>
        )}
      </div>
    </div>
  );
}
