// src/pages/Mypage/Notices.jsx

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import "../../components/Navbar.css";

import "../../components/mypage/Notices.css";

import {getNotices,                                                
} from "../../api/notices";

// 아이콘들
import megaphoneIcon from "../../assets/icons/megaphone.svg";
import giftIcon from "../../assets/icons/gift.svg";
import bellIcon from "../../assets/icons/bell.svg";
import alertIcon from "../../assets/icons/alert-circle.svg";
import calendarIcon from "../../assets/icons/calendar.svg";

export default function Notices({ onNavigate }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // 공지사항 목록 로드
  // ==========================
  const loadNotices = async () => {
    const { ok, data } = await getNotices();

    if (ok) {
      setNotices(
        data.map((n) => ({
          id: n.id,
          title: n.title,
          createdAt: n.created_at,
          category: n.category,
        }))
      );
    } else {
      alert("공지사항을 불러오지 못했습니다.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // =============== 아이콘 분기================== //
  const getCategoryIcon = (category) => {
    switch (category) {
      case "event":
        return <img src={giftIcon} alt="이벤트" className="notice-icon-img" />;
      case "update":
        return <img src={bellIcon} alt="업데이트" className="notice-icon-img" />;
      case "maintenance":
        return (
          <img src={alertIcon} alt="점검 안내" className="notice-icon-img" />
        );
      default:
        return (
          <img src={megaphoneIcon} alt="공지" className="notice-icon-img" />
        );
    }
  };

  // ======================날짜 포맷팅 ========================== //
  const formatDate = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="notices-page">
      <Header onNavigate={onNavigate} />

      <div className="notices-inner">
        {/* 상단 타이틀 + 뒤로가기 */}
        <div className="notices-top">
          <button
            className="notices-back-btn"
            type="button"
            onClick={() => onNavigate && onNavigate("profile")}
          >
            ←
          </button>
          <div className="notices-top-text">
            <h1 className="notices-title">공지사항</h1>
            <p className="notices-sub">새로운 소식을 확인해보세요</p>
          </div>
        </div>

        {/* 로딩 중 */}
        {loading && <p className="notice-loading">불러오는 중...</p>}

        {/* 공지 리스트 */}
        {!loading && notices.length > 0 ? (
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice.id}>
                <button
                  type="button"
                  className="notice-card"
                  onClick={() =>
                    onNavigate &&
                    onNavigate("notice-detail", { noticeId: notice.id })
                  }
                >
                  <div className="notice-icon-wrap">
                    {getCategoryIcon(notice.category)}
                  </div>

                  <div className="notice-text">
                    <div className="notice-title">{notice.title}</div>
                    <div className="notice-date">
                      <img
                        src={calendarIcon}
                        alt=""
                        className="notice-date-icon"
                      />
                      <span>{formatDate(notice.createdAt)}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <div className="notice-empty">
              <div className="notice-empty-circle">
                <img
                  src={megaphoneIcon}
                  alt="공지 없음"
                  className="notice-empty-icon"
                />
              </div>
              <p className="notice-empty-text">공지사항이 없어요.</p>
            </div>
          )
        )}
      </div>

      <Navbar currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}
