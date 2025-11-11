// src/pages/WriteLetter/components/CircleStage.jsx
import React from "react";
// import "../styles/CircleStage.css"; 

export default function CircleStage({
  onClickFab, 
  // 🚨 i 아이콘 클릭 핸들러 추가
  onClickInfo, 
  onSelectRecipient,
  friends,
  demoFriends = true,
  showFab = true,
  isMailboxMode = false,
}) {
  const DUMMY = [
    { id: 1, name: "조대현" }, { id: 2, name: "강준호" }, 
    { id: 3, name: "김소연" }, { id: 4, name: "박민호" }, 
    { id: 5, name: "신하은" }, { id: 6, name: "이지은" }, 
    { id: 7, name: "임승호" }, { id: 8, name: "정유나" },
  ];

  const list = demoFriends ? DUMMY : (friends ?? []);
  const SIZE = 420; 
  const R = 150;
  const center = { x: SIZE / 2, y: SIZE / 2 };
  
  // Mailbox 모드일 때 하단 UI
  const mailboxContent = (
      <div className="mailbox-bottom-section" style={{ /* 여기에 CSS 스타일 적용 필요 */ }}>
          <div className="mailbox-tab-container">
              <button className="received-tab tab-active">받은 편지 (0)</button>
              <button className="sent-tab">보낸 편지 (3)</button>
          </div>
          <div className="empty-state-card">
              <span style={{ color: '#E91E63' }}>💖</span>
              <p>아직 받은 편지가 없어요.</p>
              <p>친구들과 편지방 만들어보세요!</p>
          </div>
      </div>
  );
  
  return (
    <div className="wl-stage">
      
      {/* 🚨 상단 제목/i 아이콘 영역 - 가로 정렬 및 위치 조정을 위해 CSS 필수 */}
      <div className="wl-stage-header">
        {/* 제목 */}
        <h2 className="wl-stage-title">
          {isMailboxMode ? "누구의 편지를 볼까요?" : "누구에게 편지를 쓸까요?"}
        </h2>
        
        {/* i 아이콘 - 클릭 이벤트 연결 */}
        <span 
          className="wl-stage-info-icon" 
          onClick={onClickInfo} // 🚨 onClickInfo 연결
        >
          ⓘ
        </span>
      </div>
      
      {/* Mailbox 모드일 때만 보이는 부제목 */}
      {isMailboxMode && (
          <p className="wl-stage-subtitle" style={{ 
              position: 'absolute', 
              top: '130px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              fontSize: '14px', 
              color: '#888',
              width: 'calc(100% - 32px)',
              maxWidth: '420px',
              textAlign: 'center',
              pointerEvents: 'none'
          }}>
              프로필을 선택해서 주고받은 편지를 확인해보세요
          </p>
      )}


      <div className="wl-stage-inner" style={{ width: SIZE, height: SIZE }}>
        {/* ── 배경 3중 링, 중앙 슬롯 ── */}
        <div className="wl-ring wl-ring-1" />
        <div className="wl-ring wl-ring-2" />
        <div className="wl-ring wl-ring-3" />
        <div className="wl-center-slot">
          {/* 마스킹 테이프 UI 요소 */}
          <div className="wl-tape wl-tl" />
          <div className="wl-tape wl-tr" />
          <div className="wl-tape wl-bl" />
          <div className="wl-tape wl-br" />
          
          <div className="wl-center-image">🖼️</div>
          <div className="wl-center-label">디어리</div>
        </div>

        {/* ── 친구 아이콘(원형 배치) ── */}
        {list.map((f, idx) => {
          const angle = (2 * Math.PI * idx) / list.length - Math.PI / 2;
          const x = center.x + R * Math.cos(angle);
          const y = center.y + R * Math.sin(angle);

          return (
            <button
              key={f.id}
              className="wl-friend"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onSelectRecipient?.(f)}
            >
              <span className="wl-friend-avatar">👤</span>
              <span className="wl-friend-name">{f.name}</span>
            </button>
          );
        })}
      </div>
      
      {/* Mailbox 모드일 때 하단 섹션 추가 */}
      {isMailboxMode && mailboxContent}
    </div>
  );
}