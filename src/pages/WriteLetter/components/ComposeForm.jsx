import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../lib/toast";
import SealButton from "./SealButton";
import { FONTS, FONT_FAMILIES, PAPERS } from "../js/font";
import { createLetter } from "../../../api/compose";
import { getCurrentUser, getCurrentUserId } from "../../../utils/userInfo";
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
            // 사용자 정보 가져오기
            const currentUser = getCurrentUser();
            const currentUserId = getCurrentUserId();
            
            if (!currentUserId) {
                toast("로그인이 필요합니다.", "error");
                return;
            }
            
            // 받는 사람 ID 결정
            let receiverId;
            if (isSelf || recipientName === "나") {
                receiverId = currentUserId;
            } else {
                const friendId = handle || currentUserId;
                receiverId = parseInt(friendId, 10) || currentUserId;
            }
            
            // 이미지를 Base64로 변환
            let thumbnailBase64 = null;
            let imageData = {};
            
            if (files.length > 0) {
                // 첫 번째 이미지를 썸네일로 사용
                const file = files[0];
                thumbnailBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                
                // 모든 이미지 변환
                for (let i = 0; i < Math.min(files.length, 3); i++) {
                    const file = files[i];
                    const base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(file);
                    });
                    imageData[`image${i + 1}`] = base64;
                }
            }
            
            // 편지 데이터 구조
            const letterData = {
                id: Date.now(), // 임시 ID
                senderId: currentUserId,
                receiverId: receiverId,
                title: text.split('\n')[0].substring(0, 20) || '제목 없음',
                content: text,
                fontStyle: fontKey,
                paperTheme: paper,
                openAt: openAt,
                sentAt: new Date().toISOString().split('T')[0],
                locked: new Date(openAt) > new Date(),
                thumbnail: thumbnailBase64,
                ...imageData,
                sender: getCurrentUserNickname(),
                receiver: isSelf ? getCurrentUserNickname() : recipientName
            };
            
            // API 요청용 데이터
            const requestBody = {
                receiver_id: receiverId,
                font_style: fontKey,
                paper_theme: paper,
                content: text,
                open_at: openAt,
                image1: imageData.image1 || null,
                image2: imageData.image2 || null,
                image3: imageData.image3 || null
            };

            // localStorage에 편지 저장 (먼저 저장)
            const mailboxData = loadMailbox();
            if (!mailboxData.letters) {
                mailboxData.letters = {};
            }
            mailboxData.letters[letterData.id] = letterData;
            saveMailbox(mailboxData);
            
            console.log("편지 데이터 localStorage 저장:", letterData);
            console.log("API 전송 데이터:", requestBody);
            
            // 수신함 업데이트 이벤트 트리거
            window.dispatchEvent(new CustomEvent('mailboxUpdate'));
            
            try {
                // API 호출 시도
                const res = await createLetter(requestBody);
                console.log("API 성공:", res);
            } catch (apiError) {
                console.log("API 실패하지만 localStorage 저장 완료:", apiError);
            }
            
            const successMessage = isSelf 
                ? "나에게 쓴 편지가 성공적으로 봉인되었어요! 📮"
                : `${recipientName}님에게 편지가 성공적으로 전송되었어요! ✉️`;
            
            toast(successMessage, "success");

            // 수신함으로 이동
            nav("/mailbox", {
                replace: true,
                state: { 
                    toast: { 
                        message: "편지를 성공적으로 봉인했어요! ✉️", 
                        type: "success" 
                    }, 
                    focus: "sent" 
                },
            });
            
        } catch (err) {
            console.error("편지 전송 오류:", err);
            
            // 네트워크 오류는 이미 compose.js에서 처리됨
            if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
                const successMessage = isSelf 
                    ? "나에게 쓴 편지가 성공적으로 봉인되었어요! 📮"
                    : `편지가 성공적으로 전송되었어요! ✉️`;
                
                toast(successMessage, "success");
                
                nav("/mailbox", {
                    replace: true,
                    state: { 
                        toast: { 
                            message: "편지를 성공적으로 봉인했어요! ✉️", 
                            type: "success" 
                        }, 
                        focus: "sent" 
                    },
                });
                return;
            }
            
            toast("편지 전송 중 오류가 발생했습니다.", "error");
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

                        <div className="image-upload-container">
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
                            
                            {files.length < 3 && (
                                <button
                                    type="button"
                                    className="upload-box hoverable"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    이미지 추가 ({files.length}/3)
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bottom-spacer" />
                </div>
            </div>

            {/* ✅ 하단 고정 "편지 봉인하기" 버튼 */}
            <div className="footer-fixed">
                <div className="submit-button-area">
                    <SealButton onClick={onSeal} disabled={!text.trim()} />
                </div>
            </div>
        </div>
    );
}
