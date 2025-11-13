// src/pages/Mailbox/components/FriendConversation.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import backSvg from "../../../assets/back.svg";
import mailSvg from "../../../assets/mail.svg";   // 친구 → 나
import sendSvg from "../../../assets/send.svg";   // 나 → 친구

import "../styles/friend-conv.css";

export default function FriendConversation() {
  const location = useLocation();
  const state = location.state ?? null;
  const params = useParams();
  const navigate = useNavigate();

  // ===== 1) 라우트에서 넘어오는 id (파라미터 이름이 무엇이든 대응) =====
  let routeId = null;
  if (params && typeof params === "object") {
    if (typeof params.id === "string") {
      routeId = params.id;
    } else if (typeof params.friendId === "string") {
      routeId = params.friendId;
    } else if (typeof params.userId === "string") {
      routeId = params.userId;
    } else if (typeof params.targetId === "string") {
      routeId = params.targetId;
    } else {
      const values = Object.values(params);
      if (values.length > 0) {
        routeId = values[0];
      }
    }
  }

  // ===== 2) CircleStage / CenterHub랑 맞춰둔 더미 데이터 =====
  const DUMMY = [
    { id: 1, name: "조대현" },
    { id: 2, name: "강준호" },
    { id: 3, name: "김소연" },
    { id: 4, name: "박민호" },
    { id: 5, name: "정유나" },
    { id: 6, name: "임승호" },
    { id: 7, name: "이지은" },
    { id: 8, name: "신하은" },
  ];

  // ===== 3) 이름 찾기 =====
  let friendName = null;

  // 3-0. 나 자신(가운데 카드)인 경우
  if (routeId === "me" || String(routeId) === "0") {
    friendName = "나";
  }

  // 3-1. location.state 안에 이름 정보가 온 경우
  if (!friendName && state) {
    if (typeof state === "string") {
      friendName = state;
    } else if (typeof state === "object") {
      friendName =
        state.name ??
        state.friendName ??
        state.nickname ??
        state.displayName ??
        state.username ??
        null;
    }
  }

  // 3-2. state에 이름이 없으면 :id 로 더미에서 검색
  if (!friendName && routeId != null) {
    const found = DUMMY.find((f) => String(f.id) === String(routeId));
    if (found) friendName = found.name;
  }

  // 3-3. 그래도 없으면 마지막으로 "친구" 사용
  if (!friendName) friendName = "친구";

  // ===== 4) 탭 상태 =====
  const [tab, setTab] = useState("from"); // "from" = 친구 → 나, "to" = 나 → 친구

  const fromLetters =
    state && typeof state === "object" && Array.isArray(state.fromLetters)
      ? state.fromLetters
      : [];

  const toLetters =
    state && typeof state === "object" && Array.isArray(state.toLetters)
      ? state.toLetters
      : [];

  const fromCount = fromLetters.length;
  const toCount = toLetters.length;

  const headerLine =
    tab === "from"
      ? `${friendName}님이 보낸 편지 ${fromCount}개`
      : `${friendName}님에게 보낸 편지 ${toCount}개`;

  const isEmpty = (tab === "from" ? fromCount : toCount) === 0;

  const handleBack = () => {
    navigate(-1);
  };

  const handleWrite = () => {
    navigate("/write", {
      state: {
        recipient:
          state && typeof state === "object"
            ? state
            : { id: routeId, name: friendName },
      },
    });
  };

  // 편지 카드 더미 (아직 진짜 데이터 없을 때 모양용)
  const sampleCard = {
    dday: 48,
    openAt: "2025. 12. 31.",
    locked: true,
  };

  const cards = tab === "from" ? fromLetters : toLetters;

  return (
    <div className="fc-page">
      {/* ===== 헤더 ===== */}
      <header className="fc-header">
        <button
          type="button"
          onClick={handleBack}
          className="fc-back-btn"
          aria-label="뒤로가기"
        >
          <img src={backSvg} alt="" className="fc-back-icon" />
        </button>

        <div className="fc-header-text">
          <h1 className="fc-title">{friendName}님과의 편지</h1>
          <p className="fc-sub">{headerLine}</p>
        </div>
      </header>

      {/* ===== 탭 ===== */}
      <section className="fc-tabs-wrap">
        <div className="fc-tabs">
          <button
            type="button"
            className={`fc-tab ${tab === "from" ? "fc-tab--active" : ""}`}
            onClick={() => setTab("from")}
          >
            <span>{friendName}</span>
            <span className="fc-tab-arrow"> → </span>
            <span>나</span>
            <span className="fc-tab-count">({fromCount})</span>
          </button>

          <button
            type="button"
            className={`fc-tab ${tab === "to" ? "fc-tab--active" : ""}`}
            onClick={() => setTab("to")}
          >
            <span>나</span>
            <span className="fc-tab-arrow"> → </span>
            <span>{friendName}</span>
            <span className="fc-tab-count">({toCount})</span>
          </button>
        </div>
      </section>

      {/* ===== 내용 ===== */}
      <section className="fc-body">
        {isEmpty ? (
          // ===== 비어 있을 때 =====
          <div className="fc-empty-box">
            <div className="fc-empty-icon-circle">
              <img
                src={tab === "from" ? mailSvg : sendSvg}
                alt=""
                className="fc-empty-icon"
              />
            </div>

            <div className="fc-empty-text">
              <p className="fc-empty-title">
                {tab === "from"
                  ? `${friendName}님이 보낸 편지가 없어요.`
                  : `${friendName}님에게 보낸 편지가 없어요.`}
              </p>
              <p className="fc-empty-sub">
                {tab === "from"
                  ? "친구가 편지를 보낼 때까지 기다려보세요 💌"
                  : "친구에게 특별한 메시지를 전해보세요 💝"}
              </p>
            </div>

            {tab === "to" && (
              <button
                type="button"
                className="fc-empty-cta"
                onClick={handleWrite}
              >
                <span className="fc-empty-cta-icon">✉️</span>
                <span>편지 쓰기</span>
              </button>
            )}
          </div>
        ) : (
          // ===== 편지가 있을 때 카드 리스트 =====
          <div className="fc-card-list">
            {(cards.length ? cards : [sampleCard]).map((card, idx) => (
              <article key={idx} className="fc-card">
                <div className="fc-card-top">
                  <span className="fc-dday">
                    D-{card.dday ?? sampleCard.dday}
                  </span>
                  <span className="fc-card-mail">✉️</span>
                </div>

                <div className="fc-card-lock">🔒</div>

                <p className="fc-card-open">
                  {(card.openAt ?? sampleCard.openAt) + "에 공개"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
