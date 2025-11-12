// src/pages/Mailbox/components/FriendConversation.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// 같은 폴더의 컴포넌트들
import ConversationHeader from "./ConversationHeader.jsx";
import MailboxTab from "./MailboxTab.jsx";

// 스타일 경로 주의: pages/Mailbox/styles, components/styles 둘 다 씀
import "../styles/Mailbox.css";          // 공통 레이아웃
import "./styles/empty-card.css";        // 빈 상태 카드 (components/styles)

export default function FriendConversation() {
  const { friendId } = useParams();
  const nav = useNavigate();

  const friendName = decodeURIComponent(friendId);
  const [tab, setTab] = React.useState("received"); // 'received' = 친구→나

  return (
    <div className="mailbox-screen">
      <ConversationHeader
        title={`${friendName}님과의 편지`}
        subtitle={`${friendName}이 보낸 편지 0개`}
        onBack={() => nav(-1)}
      />

      <MailboxTab
        tab={tab}
        setTab={setTab}
        labels={{ received: `${friendName} → 나`, sent: `나 → ${friendName}` }}
      />

      {/* 빈 상태 예시 (empty-card.css 사용) */}
      <div className="mbx-empty">
        <div className="mbx-empty-card">
          <div className="mbx-empty-icon" />
          <h3 className="mbx-empty-title">{friendName}님이 보낸 편지가 없어요.</h3>
          <p className="mbx-empty-sub">친구가 편지를 보낼 때까지 기다려보세요 💌</p>
        </div>
      </div>
    </div>
  );
}
