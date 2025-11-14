// src/pages/Mailbox/components/FriendConversation.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import backSvg from "../../../assets/back.svg";
import mailSvg from "../../../assets/mail.svg";   // 친구 → 나
import sendSvg from "../../../assets/send.svg";   // 나 → 친구

import "../styles/friend-conv.css";

export default function FriendConversation() {
    const { friends } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state ?? null;

    // ===== 1) 라우트에서 넘어오는 id =====
    const routeId = friends; // "/mailbox/:friends" 에서 온 값 (문자열)

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
    if (routeId === "me" || routeId === "0") {
        friendName = "나";
    }

    // 3-1. location.state 안에 이름 정보가 온 경우
    if (!friendName && state) {
        if (typeof state === "string") {
            friendName = state;
        } else if (typeof state === "object") {
            friendName =
                state.recipientName ??
                state.name ??
                state.friendName ??
                state.nickname ??
                state.displayName ??
                state.username ??
                null;
        }
    }

    // 3-2. state에 이름이 없으면 :friends 로 더미에서 검색
    if (!friendName && routeId != null) {
        const found = DUMMY.find(
            (f) => String(f.id) === String(routeId) || f.name === routeId
        );
        if (found) friendName = found.name;
    }

    // 3-3. 그래도 없으면 기본값
    if (!friendName) friendName = routeId;

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
        navigate("/mailbox");
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
                    <div className="mbx-empty-panel">
                        <div className="mbx-empty-icon-wrap">
                            {/* <img src={mailSvg} alt="" /> 같은 아이콘 넣어도 됨 */}
                        </div>
                        <p className="mbx-empty-main">
                            {tab === "from"
                                ? `아직 ${friendName}님이 보낸 편지가 없어요.`
                                : `아직 ${friendName}님에게 보낸 편지가 없어요.`}
                        </p>
                        <p className="mbx-empty-sub">
                            친구들과 편지방을 만들어보세요!
                        </p>
                    </div>
                ) : (
                    <div className="mbx-mail-grid-wrap">
                        <ul className="mbx-mail-grid">
                            {cards.map((item) => (
                                <li key={item.id} className="mbx-mail-card">
                                    <div className="mbx-mail-card-inner">
                                        <div className="mbx-mail-card-top">
                                            <span className="mbx-mail-badge">D-{item.dday}</span>
                                            <span className="mbx-mail-date">{item.openAt}</span>
                                        </div>
                                        <div className="mbx-mail-card-body">
                                            <div className="mbx-mail-card-title">
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}
