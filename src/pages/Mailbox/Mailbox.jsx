// src/pages/Mailbox/Mailbox.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MailboxHeader from "./components/MailboxHeader.jsx";
import MailboxTab from "./components/MailboxTab.jsx";
import ReceivedLetters from "./components/ReceivedLetters.jsx";
import SentLetters from "./components/SentLetters.jsx";
import CenterHub from "./components/CenterHub.jsx";

import "./styles/Mailbox.css";

export default function Mailbox() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState(state?.focus ?? "received"); // 'received' | 'sent'

  useEffect(() => {
    if (state?.toast) {
      setToast(state.toast);
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  // ===== 배치 상수 (허브 높이 + 간격) =====
  const HUB_SIZE = 360;      // CenterHub의 실제 높이(px)
  const HUB_GAP  = 24;       // 허브와 탭 사이 여백(px)
  const HUB_TOP  = 244.67;   // 상단 기준으로 허브가 위치하는 top 값

  // 중앙 허브 클릭 동작
  const handleSelectSelf = () => setTab("received");

  // ✅ 친구 선택 시: 대화 화면으로 이동 + 이름/아이디를 state로 전달
  const handleSelectFriend = (friend) => {
    const id = friend?.id ?? friend?.name ?? "";
    const name = friend?.name ?? String(friend?.id ?? "");
    const slug = encodeURIComponent(id);

    navigate(`/mailbox/conversation/${slug}`, {
      state: {
        recipientId: id,
        recipientName: name,   // ← ConversationHeader에서 이 값을 읽어 제목: `${name}에게 쓰는 편지`
        isSelf: false,
        from: "mailbox-centerhub",
      },
    });
  };

  return (
    <div
      className="mailbox-screen"
      style={{
        position: "relative",
        // 아래 CSS 변수로 하위 컴포넌트/스타일에서 참조 가능
        "--hub-size": `${HUB_SIZE}px`,
        "--hub-gap": `${HUB_GAP}px`,
      }}
    >
      {toast && (
        <div className={`toast-banner ${toast.type === "success" ? "ok" : ""}`}>
          <span className="toast-dot" />
          {toast.message}
        </div>
      )}

      {/* 상단 히어로/안내 영역 */}
      <MailboxHeader />

      {/* 중앙 원형 허브 (absolute 배치) */}
      <CenterHub
        favorites={[]}     // 즐겨찾기/친구 리스트 (없으면 데모 8명)
        demo={true}
        onSelectSelf={handleSelectSelf}
        onSelectFriend={handleSelectFriend}
        top={HUB_TOP}
      />

      {/* ⭐ 허브 높이만큼 공간 확보 (겹침 방지 스페이서) */}
      <div aria-hidden style={{ height: HUB_TOP + HUB_SIZE + HUB_GAP }} />

      {/* 탭 */}
      <MailboxTab tab={tab} setTab={setTab} />

      {/* 리스트 */}
      {tab === "received" ? <ReceivedLetters /> : <SentLetters />}

      {/* 하단 네비가 가리지 않도록 여백 (공통 Navbar 쓰는 경우) */}
      <div aria-hidden style={{ height: "var(--navbar-height, 78px)" }} />
    </div>
  );
}
