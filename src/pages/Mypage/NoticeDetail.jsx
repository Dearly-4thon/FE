// src/pages/Mypage/NoticeDetail.jsx
import Header from "../../components/Header";
import Navbar from '../../components/Navbar';
import '../../components/Navbar.css';
import { notices } from "../../utils/mockData";

import "../../components/mypage/NoticeDetail.css";

// 아이콘들
import megaphoneIcon from "../../assets/icons/megaphone.svg";
import giftIcon from "../../assets/icons/gift.svg";
import bellIcon from "../../assets/icons/bell.svg";
import alertCircleIcon from "../../assets/icons/alert-circle.svg";
import calendarIcon from "../../assets/icons/calendar.svg";

export default function NoticeDetail({ noticeId, onNavigate, onBack }) {
  const notice = notices.find((n) => n.id === noticeId);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "event":
        return giftIcon;
      case "update":
        return bellIcon;
      case "maintenance":
        return alertCircleIcon;
      default:
        return megaphoneIcon;
    }
  };

  const formatDate = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleBack = () => {
    if (onBack) onBack();
    else onNavigate && onNavigate("notices");
  };

  // 공지 못 찾았을 때
  if (!notice) {
    return (
      <div className="notice-detail-page">
        <Header onNavigate={onNavigate} />

        <div className="notice-detail-inner">
          <button type="button" className="notice-back-btn" onClick={handleBack}>
            ← 목록으로
          </button>

          <div className="notice-missing-box">
            <p>공지사항을 찾을 수 없어요.</p>
            <button
              type="button"
              className="notice-detail-bottom-btn"
              onClick={handleBack}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>

        <Navbar currentPage="profile" onNavigate={onNavigate} />

      </div>
    );
  }

  return (
    <div className="notice-detail-page">
      <Header onNavigate={onNavigate} />

      <div className="notice-detail-inner">
        {/* 상단 뒤로가기 */}
        <button
          type="button"
          className="notice-back-btn"
          onClick={handleBack}
        >
          ← 목록으로
        </button>

        {/* 본문 카드 */}
        <section className="notice-detail-card">
          {/* 카테고리 아이콘 동그라미 */}
          <div className="notice-detail-icon-wrap">
            <div className="notice-detail-icon-circle">
              <img
                src={getCategoryIcon(notice.category)}
                alt=""
                className="notice-detail-icon"
              />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="notice-detail-title">{notice.title}</h1>

          {/* 날짜 */}
          <div className="notice-detail-date-row">
            <img
              src={calendarIcon}
              alt=""
              className="notice-detail-calendar-icon"
            />
            <span>{formatDate(notice.createdAt)}</span>
          </div>

          <div className="notice-detail-divider" />

          {/* 내용 */}
          <div className="notice-detail-content">
            {notice.content}
          </div>
        </section>

        {/* 목록으로 버튼 */}
        <button
          type="button"
          className="notice-detail-bottom-btn"
          onClick={handleBack}
        >
          목록으로 돌아가기
        </button>
      </div>

      <BottomTabBar currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}
