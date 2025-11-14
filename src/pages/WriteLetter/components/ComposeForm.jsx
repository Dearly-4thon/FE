import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../lib/toast";
import SealButton from "./SealButton";
import { FONTS, FONT_FAMILIES, PAPERS } from "../js/font";
import { createLetter } from "../../../api/compose";
import "../styles/compose.css";

// ===== localStorage 유틸 =====
const LS_KEY = "dearly-mailbox";
const loadMailbox = () => {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
        return {};
    }
};
const saveMailbox = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));

export default function ComposeForm() {
    const nav = useNavigate();
    const [fontKey, setFontKey] = useState("basic");
    const [paper, setPaper] = useState("white");
    const [text, setText] = useState("");
    const [openAt, setOpenAt] = useState("2025-12-31");

    const { handle } = useParams();
    const location = useLocation();
    const state = location.state || {};
    const showBackFromState = state?.showBack;

    // ===== URL 쿼리 읽기 =====
    const qs = new URLSearchParams(location.search);
    const qsTo = (qs.get("to") || "").toLowerCase();
    const qsName = qs.get("name") ? decodeURIComponent(qs.get("name")) : undefined;

    // ===== 수신자 이름/자기자신 판정 =====
    const rawName = state?.friendName || qsName || handle || "";
    const isSelf =
        state?.isSelf === true ||
        qsTo === "self" ||
        qsTo === "me" ||
        rawName === "나" ||
        rawName.toLowerCase?.() === "me";
    const recipientName = isSelf ? "나" : rawName || "나";

    // ===== 헤더 메타 =====
    const meta = useMemo(() => {
        const baseShowBack =
            showBackFromState !== undefined ? showBackFromState : true;

        if (recipientName === "나") {
            return {
                title: "나에게 쓰는 편지",
                subtitle: "미래의 나에게 남기는 메시지",
                showBack: baseShowBack,
            };
        }
        return {
            title: `${recipientName}에게 쓰는 편지`,
            subtitle: `${recipientName}님에게 전하는 메시지`,
            showBack: baseShowBack,
        };
    }, [recipientName, showBackFromState]);

    // ✅ 이미지 추가 useState
    const [files, setFiles] = useState([]); // File[]
    const fileInputRef = useRef(null);

    const currentFontCss = useMemo(
        () => FONTS.find((f) => f.key === fontKey)?.css ?? "font-basic",
        [fontKey]
    );
    const currentFontFamily = FONT_FAMILIES[fontKey];

    // ===== 이미지 선택 핸들러 =====
    const onPickFiles = (e) => {
        const list = Array.from(e.target.files || []);
        const remain = Math.max(0, 3 - files.length);
        const next = list.slice(0, remain);

        if (list.length > remain) {
            toast("이미지는 최대 3장까지만 업로드할 수 있어요.", "error");
        }
        setFiles((prev) => [...prev, ...next]);
        e.target.value = "";
    };

    const removeAt = (idx) =>
        setFiles((prev) => prev.filter((_, i) => i !== idx));

    // ===== 봉인 로직 =====
    const onSeal = async () => {
        if (!text.trim()) {
            toast("편지내용을 입력해주세요", "error");
            return;
        }

        try {
            // 스웨거 스펙에 맞는 JSON 구조로 변경
            const requestBody = {
                sender: {
                    id: 1, // TODO: 실제 로그인한 사용자 ID로 변경 필요
                    nickname: "", // TODO: 실제 사용자 닉네임으로 변경
                    profile_image: null
                },
                receiver: isSelf ? null : {
                    id: 2, // TODO: 실제 receiver_id로 변경 필요
                    nickname: "", // TODO: 실제 receiver 닉네임으로 변경
                    profile_image: null
                },
                font_style: fontKey.toUpperCase(), // "BASIC", "DUNGGEUN" 등
                paper_theme: paper.toUpperCase(), // "WHITE", "LAVENDER" 등
                content: text,
                open_at: `${openAt}T00:00:00.000Z`, // ISO 형식으로 변환
                image1: null, // TODO: 이미지 업로드 구현 필요
                image2: null,
                image3: null,
                is_open: false,
                is_self_letter: isSelf,
                created_at: new Date().toISOString()
            };

            // letters.js의 createLetter 함수 사용
            const receiverId = isSelf ? null : 2; // TODO: 실제 receiver_id로 변경
            const res = await createLetter(requestBody, receiverId);

            console.log("서버 응답:", res.data);
            
            if (isSelf) {
                toast("나에게 쓴 편지가 성공적으로 봉인되었어요! 📮", "success");
            } else {
                toast(`${recipientName}님에게 편지가 성공적으로 전송되었어요! ✉️`, "success");
            }

            // 수신함으로 이동 + 보낸편 탭 포커스
            nav("/mailbox", {
                replace: true,
                state: { toast: "편지를 봉인했어요 ✉️", focus: "sent" },
            });
        } catch (err) {
            console.log(err);
            toast("오류가 발생했어요 💦", "error");
        }
    };

    // ===== 렌더링 =====
    return (
        <div className="compose-screen plain">
            {/* ── 헤더 ── */}
            <header className="wl-compose-header">
                <div className="wl-header-row">
                    {meta.showBack && (
                        <button
                            className="wl-back-btn"
                            onClick={() => nav(-1)}
                            aria-label="뒤로가기"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    d="M10.0001 15.8327L4.16675 9.99935L10.0001 4.16602"
                                    stroke="#1E3A8A"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15.8334 10H4.16675"
                                    stroke="#1E3A8A"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}

                    <div className="wl-title-group">
                        <h2 className="wl-header-title">{meta.title}</h2>
                        <p className="wl-header-sub">{meta.subtitle}</p>
                    </div>
                </div>
            </header>

            {/* ── 스크롤 컨텐츠 ── */}
            <div className="compose-stage">
                <div className="compose-scroll">
                    {/* 폰트 선택 */}
                    <div className="block">
                        <div className="block-title">폰트 선택</div>
                        <div className="grid grid-2">
                            {FONTS.map((f) => (
                                <button
                                    key={f.key}
                                    type="button"
                                    className={`option hoverable ${fontKey === f.key ? "active" : ""
                                        }`}
                                    onClick={() => setFontKey(f.key)}
                                >
                                    <div className="option-caption">{f.label}</div>
                                    <div className={`option-sample ${f.css}`}>{f.sample}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 편지지 선택 */}
                    <div className="block">
                        <div className="block-title">편지지 선택</div>
                        <div className="paper-chips-scroll">
                            <div className="paper-chips-container">
                                {PAPERS.map((p) => (
                                    <button
                                        key={p.key}
                                        type="button"
                                        className={`chip hoverable ${p.chip} ${paper === p.key ? "active" : ""
                                            }`}
                                        onClick={() => setPaper(p.key)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 본문 */}
                    <div className="block">
                        <div className="block-title">편지 내용</div>
                        <div className="editor-container">
                            <div
                                className={`editor hoverable paper-${paper} ${currentFontCss}`}
                                style={{ fontFamily: currentFontFamily }}
                            >
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={
                                        recipientName === "나"
                                            ? "미래의 나에게 전하고 싶은 말을 적어보세요…"
                                            : `${recipientName}님에게 전하고 싶은 말을 적어보세요…`
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* 공개 날짜 */}
                    <div className="block">
                        <div className="block-title">공개 날짜</div>
                        <div className="date-field hoverable no-icon">
                            <input
                                type="date"
                                value={openAt}
                                onChange={(e) => setOpenAt(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="block">
                        <div className="block-title">이미지 추가 (선택)</div>
                        <p className="image-sub">첫 번째 사진이 썸네일로 표시돼요</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onPickFiles}
                            hidden
                        />

                        {files.length < 3 && (
                            <button
                                type="button"
                                className="upload-box hoverable"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                이미지 추가 ({files.length}/3)
                            </button>
                        )}

                        {files.length > 0 && (
                            <div className="thumbs" aria-label="첨부 미리보기">
                                {files.map((f, i) => (
                                    <div className="thumb" key={`${f.name}-${i}`}>
                                        <img src={URL.createObjectURL(f)} alt="" />
                                        <button
                                            className="thumb-x"
                                            type="button"
                                            onClick={() => removeAt(i)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bottom-spacer" />
                </div>
            </div>

            {/* ✅ 하단 고정 "편지 봉인하기" 버튼 */}
            <div className="footer-fixed">
                <div className="submit-button-area">
                    <SealButton 
                        onClick={onSeal} 
                        disabled={!text.trim()} 
                    />
                </div>
            </div>
        </div>
    );
}
