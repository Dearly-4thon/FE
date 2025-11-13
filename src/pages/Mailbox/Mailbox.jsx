// src/pages/Mailbox/Mailbox.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MailboxHeader from "./components/MailboxHeader.jsx";
import MailboxTab from "./components/MailboxTab.jsx";
import ReceivedLetters from "./components/ReceivedLetters.jsx";
import SentLetters from "./components/SentLetters.jsx";
import CenterHub from "./components/CenterHub.jsx";

import "./styles/Mailbox.css";

export default function Mailbox() {
  const { state } = useLocation();

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

  // ✅ 가운데 내 카드 → 보낸편지 탭으로만 전환
  const handleSelectSelf = () => {
    setTab("sent");
    setToast({
      type: "info",
      message: "나에게 보낸 편지는 하단 '보낸편지'에서 확인할 수 있어요.",
    });
  };

  // ✅ 친구 카드 → 일단 수신함 탭 유지 + 안내만
  const handleSelectFriend = (friend) => {
    const name = friend?.name ?? "친구";
    setTab("received");
    setToast({
      type: "info",
      message: `${name}와의 개별 대화 화면은 추후 업데이트 예정이에요.`,
    });
  };

  return (
    // 💛 PWA 393짜리 전체 배경용 래퍼
    <div className="mailbox-page">
      <div
        className="mailbox-screen"
        style={{
          position: "relative",
          "--hub-size": `${HUB_SIZE}px`,
          "--hub-gap": `${HUB_GAP}px`,
          "--hub-top": `${HUB_TOP}px`, // 스페이서 계산용
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

        {/* 허브 아래로 리스트를 밀어주는 스페이서 */}
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
