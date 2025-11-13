// src/pages/Mailbox/components/SentToMePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowUpDown, Send, Mail } from "lucide-react";
import "../styles/sent-to-me.css";

export default function SentToMePage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");

  const toggleSort = () => {
    setSort((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  const goWriteLetter = () => {
    // ⭐ 편지쓰기 버튼 → 편지쓰기 메인 (WriteLetterForm.jsx)
    navigate("/write");
  };

  return (
    <div className="stm-container">
      {/* 헤더 */}
      <header className="stm-header">
        <button className="stm-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>

        <div className="stm-titles">
          <h1 className="stm-title">나에게 보낸 편지</h1>
          <p className="stm-count">총 0개</p>
        </div>

        <button className="stm-sort-btn" onClick={toggleSort}>
          <ArrowUpDown size={16} />
          <span>{sort === "latest" ? "최신순" : "오래된순"}</span>
        </button>
      </header>

      {/* 빈 상태 박스 */}
      <section className="stm-empty-box">
        <div className="stm-empty-circle">
          <Send size={40} className="stm-empty-icon" />
        </div>

        <p className="stm-empty-main">나에게 보낸 편지가 없어요.</p>
        <p className="stm-empty-sub">미래의 나에게 편지를 보내보세요 ✍️</p>

        <button className="stm-write-btn" onClick={goWriteLetter}>
          <Mail size={18} />
          <span>편지 쓰기</span>
        </button>
      </section>
    </div>
  );
}
