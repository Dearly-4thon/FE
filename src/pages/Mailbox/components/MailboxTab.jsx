// src/pages/Mailbox/components/MailboxTabs.jsx
import React from "react";
import { Ban } from "lucide-react";

// ✔ CSS 경로 정확하게 수정!
import "../styles/mailbox-tab.css";

import ReceivedLetters from "./ReceivedLetters.jsx";
import SentLetters from "./SentLetters.jsx";

/**
 * MailboxTabs
 *
 * props:
 *  - tab: 'received' | 'sent'
 *  - setTab: 탭 변경 함수
 *  - receivedCount: 받은 편지 개수
 *  - sentCount: 보낸 편지 개수
 *  - hubHeight, offset, navbarHeight: 위치 조정
 */
export default function MailboxTabs({
  tab = "received",
  setTab,
  receivedCount = 0,
  sentCount = 0,
  hubHeight = 360,
  offset = 24,
  navbarHeight = 78,
}) {
  // CenterHub 아래로 내리기
  // CenterHub 아래 고정 간격 32px
  const wrapStyle = {
    marginTop: "32px"
  };

  // 하단 네비게이션 여백
  const bottomSpacerStyle = {
    height: `var(--navbar-height, ${navbarHeight}px)`,
  };

  const handleTabClick = (next) => {
    if (!setTab || tab === next) return;
    setTab(next);
  };

  return (
    <section className="mbx-tabs-section" style={wrapStyle}>
      {/* ========== 탭 버튼줄 ========== */}
      <div className="mbx-tabs-wrap">
        {/* 왼쪽 검정 버튼 (필터) */}


        {/* 오른쪽 캡슐 탭 */}
        <div className="mbx-tabs">
          <button
            type="button"
            className={`mbx-tab ${tab === "received" ? "mbx-tab--active" : ""
              }`}
            onClick={() => handleTabClick("received")}
          >
            <span className="mbx-tab-label">받은 편지</span>
            <span className="mbx-tab-count">({receivedCount})</span>
          </button>

          <button
            type="button"
            className={`mbx-tab ${tab === "sent" ? "mbx-tab--active" : ""}`}
            onClick={() => handleTabClick("sent")}
          >
            <span className="mbx-tab-label">보낸 편지</span>
            <span className="mbx-tab-count">({sentCount})</span>
          </button>
        </div>
      </div>

      {/* ========== 콘텐츠 영역 ========== */}
      <div className="mbx-panel">
        {tab === "received" ? <ReceivedLetters /> : <SentLetters />}
      </div>

      {/* ========== 하단 네비게이션 높이만큼 여백 ========== */}
      <div style={bottomSpacerStyle} />
    </section>
  );
}
