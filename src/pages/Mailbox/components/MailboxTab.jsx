// src/pages/Mailbox/components/MailboxTabs.jsx
import React, { useState } from "react";
import { Lock, Clock } from "lucide-react";

/**
 * CenterHub 아래로 정확히 내려오게 하기 위한 탭 컴포넌트
 * - hubHeight: CenterHub(원형 허브)의 실제 높이(px). 기본 360.
 * - offset: 허브와의 간격(px). 기본 24.
 * - navbarHeight: 하단 네비 높이 변수 없을 때 대비용. 기본 78.
 */
const sentDemo = [
  { id: 1, title: "민호야 취업 진심으로…", dday: 49, openAt: "2025. 12. 31", locked: true },
  { id: 2, title: "생일 축하해!", dday: 7, openAt: "2025. 11. 19", locked: true },
  { id: 3, title: "겨울 방학 계획 공유", dday: 12, openAt: "2025. 11. 24", locked: true },
  { id: 4, title: "우리 팀 회고 편지", dday: 3, openAt: "2025. 11. 15", locked: true },
];

export default function MailboxTabs({
  hubHeight = 360,
  offset = 24,
  navbarHeight = 78,
}) {
  const [tab, setTab] = useState("inbox"); // 'inbox' | 'sent'

  // CenterHub 아래로 내리기: 허브 높이 + 간격
  const wrapStyle = {
    marginTop: `calc(${hubHeight}px + ${offset}px)`,
    position: "relative",
    zIndex: 50, // 허브가 위(예: 200)라면 탭은 그보다 낮거나 동일/아래로
  };

  // 하단 네비에 안 가리도록 여백
  const bottomSpacerStyle = {
    height: "var(--navbar-height, " + navbarHeight + "px)",
  };

  return (
    <div className="mbx-tabs-wrap" style={wrapStyle}>
      {/* 탭 버튼 */}
      <div className="mbx-tabs">
        <button
          className={`tab ${tab === "inbox" ? "is-active" : ""}`}
          onClick={() => setTab("inbox")}
          type="button"
        >
          받은 편지 (0)
        </button>
        <button
          className={`tab ${tab === "sent" ? "is-active" : ""}`}
          onClick={() => setTab("sent")}
          type="button"
        >
          보낸 편지 ({sentDemo.length})
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="mbx-panel">
        {tab === "inbox" ? (
          <div className="mbx-empty" role="status" aria-live="polite">
            <div className="icon" />
            <p className="title">아직 받은 편지가 없어요.</p>
            <p className="msg">친구들과 편지방을 만들어보세요!</p>
          </div>
        ) : (
          <div className="mbx-grid" role="list">
            {sentDemo.map((it) => (
              <div key={it.id} className="mbx-card" role="listitem" tabIndex={0}>
                <div className="row-top">
                  <span className="title">{it.title}</span>
                  <span className="dday" aria-label={`디데이 ${it.dday}`}>
                    <Clock size={14} aria-hidden />
                    &nbsp;D-{it.dday}
                  </span>
                </div>
                <div className="thumb" aria-label={it.locked ? "잠긴 편지" : "편지 미리보기"}>
                  {it.locked && <Lock size={28} className="lock" aria-hidden />}
                </div>
                <div className="row-btm">
                  <span className="from">디어리 올림</span>
                  <span className="open-at">{it.openAt}에 공개</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 네비게이션에 가리지 않도록 하단 여백 */}
      <div style={bottomSpacerStyle} />
    </div>
  );
}
