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
  const HUB_SIZE = 360; // CenterHub의 실제 높이(px)
  const HUB_GAP = 24;   // 허브와 탭 사이 여백(px)
  const HUB_TOP = 160;  // 상단 기준으로 허브가 위치하는 top 값

  // ✅ 가운데 내 카드 → "나에게 보낸 편지" 화면으로 이동
  const handleSelectSelf = () => {
    navigate("/mailbox/conversation/me", {
      state: {
        isSelf: true,
        from: "mailbox-centerhub",
      },
    });
  };

  // ✅ 친구 카드 → 친구와의 편지 화면
  const handleSelectFriend = (friend) => {
    const id = friend?.id ?? friend?.name ?? "";
    const name = friend?.name ?? String(friend?.id ?? "");
    const slug = encodeURIComponent(id);

    navigate(`/mailbox/conversation/${slug}`, {
      state: {
        recipientId: id,
        recipientName: name,
        isSelf: false,
        from: "mailbox-centerhub",
      },
    });
  };

  return (
    <div className="mailbox-page">
      <div
        className="mailbox-screen"
        style={{
          position: "relative",
          "--hub-size": `${HUB_SIZE}px`,
          "--hub-gap": `${HUB_GAP}px`,
          "--hub-top": `${HUB_TOP}px`,
        }}
      >
        {toast && (
          <div
            className={`toast-banner ${
              toast.type === "success" ? "ok" : ""
            }`}
          >
            <span className="toast-dot" />
            {toast.message}
          </div>
        )}

        {/* 상단 히어로/안내 영역 */}
        <MailboxHeader />

        {/* 중앙 원형 허브 (absolute 배치) */}
        <CenterHub
          favorites={[]}
          demo={true}
          onSelectSelf={handleSelectSelf}
          onSelectFriend={handleSelectFriend}
          top={HUB_TOP}
        />

        {/* 허브 높이만큼 간격 확보 */}
        <div aria-hidden className="mbx-center-spacer" />

        {/* 탭 */}
        <MailboxTab tab={tab} setTab={setTab} />

        {/* 리스트 (메인 수신함) */}
        {tab === "received" ? <ReceivedLetters /> : <SentLetters />}

        {/* 하단 네비 여백 */}
        <div aria-hidden style={{ height: "var(--navbar-height, 78px)" }} />
      </div>
    </div>
  );
}
