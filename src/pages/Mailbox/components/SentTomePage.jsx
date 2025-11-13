// src/pages/Mailbox/components/SentToMePage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowUpDown, Clock, Mail, Lock } from "lucide-react";
import "../../../styles/fonts.css";
import "../styles/sent-to-me.css"; // 이 파일은 나중에 만들면 돼!

const LS_KEY = "dearly-mailbox";

const loadMailbox = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

// ★ 실제 데이터 구조는 프로젝트에 맞게 고치면 돼!
//   일단 selfLetters(나에게 보낸 편지) 가 있다고 가정하고,
//   없으면 demo 데이터로 채워줄게.
const pickSelfLetters = (mailbox) => {
  if (Array.isArray(mailbox.selfLetters) && mailbox.selfLetters.length > 0) {
    return mailbox.selfLetters;
  }
  return null;
};

// 데모 카드 (화면 UI 확인용)
const DEMO_LETTERS = [
  {
    id: 1,
    title: "겨울 방학 계획 정리",
    dday: 48,
    openAt: "2025. 12. 31.",
    locked: true,
  },
  {
    id: 2,
    title: "이번 학기 수고했어",
    dday: 48,
    openAt: "2025. 12. 31.",
    locked: true,
  },
  {
    id: 3,
    title: "내년 목표 리스트",
    dday: 48,
    openAt: "2025. 12. 31.",
    locked: true,
  },
  {
    id: 4,
    title: "중간 점검 편지",
    dday: 48,
    openAt: "2025. 12. 31.",
    locked: true,
  },
];

export default function SentToMePage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest"); // "latest" | "oldest"

  const mailbox = useMemo(() => loadMailbox(), []);
  const letters = useMemo(() => {
    const fromStore = pickSelfLetters(mailbox);
    return fromStore ?? DEMO_LETTERS;
  }, [mailbox]);

  const sortedLetters = useMemo(() => {
    const base = [...letters];
    // 정렬 로직은 열리는 날짜 기준으로 간단하게 (문자열 비교)
    base.sort((a, b) => {
      if (sort === "latest") return (b.openAt || "").localeCompare(a.openAt || "");
      return (a.openAt || "").localeCompare(b.openAt || "");
    });
    return base;
  }, [letters, sort]);

  const handleToggleSort = () => {
    setSort((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  const count = letters.length;

  return (
    <div className="stm-page">
      {/* ===== 상단 헤더 영역 ===== */}
      <header className="stm-header">
        <button
          type="button"
          className="stm-back-btn"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={22} />
        </button>

        <div className="stm-title-wrap">
          <h1 className="stm-title font-basic">나에게 보낸 편지</h1>
          <p className="stm-sub font-basic">총 {count}개</p>
        </div>

        <button
          type="button"
          className="stm-sort-btn"
          onClick={handleToggleSort}
        >
          <ArrowUpDown size={16} className="stm-sort-icon" />
          <span>{sort === "latest" ? "최신순" : "오래된순"}</span>
        </button>
      </header>

      {/* ===== 카드 리스트 영역 ===== */}
      <section className="stm-list">
        {sortedLetters.length === 0 ? (
          <div className="stm-empty">
            <div className="stm-empty-inner">
              <div className="stm-empty-icon">
                <Mail size={32} />
              </div>
              <p className="stm-empty-main font-basic">
                나에게 보낸 편지가 없어요.
              </p>
              <p className="stm-empty-sub font-basic">
                오늘의 나에게 따뜻한 편지를 남겨보는 건 어떨까요? 💌
              </p>
            </div>
          </div>
        ) : (
          <div className="stm-grid">
            {sortedLetters.map((letter) => (
              <article key={letter.id} className="stm-card">
                {/* 상단 D-day + 봉투 아이콘 */}
                <div className="stm-card-top">
                  <div className="stm-dday-pill">
                    <Clock size={14} className="stm-dday-icon" />
                    <span className="stm-dday-text">
                      {letter.dday != null ? `D-${letter.dday}` : "D-Day"}
                    </span>
                  </div>
                  <Mail size={18} className="stm-mail-icon" />
                </div>

                {/* 가운데 자물쇠 + 제목 */}
                <div className="stm-card-middle">
                  {letter.locked && (
                    <Lock size={40} className="stm-lock-icon" />
                  )}
                  <div className="stm-card-title font-basic">
                    {letter.title || "나에게"}
                  </div>
                  <div className="stm-card-to font-basic">나에게</div>
                </div>

                {/* 하단 공개일 */}
                <div className="stm-card-bottom font-basic">
                  {letter.openAt ? `${letter.openAt}에 공개` : "공개일 미정"}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
