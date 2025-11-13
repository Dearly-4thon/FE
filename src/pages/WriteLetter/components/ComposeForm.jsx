// src/pages/WriteLetter/components/ComposeForm.jsx
import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SealButton from "./SealButton";
import { toast } from "../../../lib/toast";
import "../styles/compose.css";

// ===== 옵션 정의 =====
const FONTS = [
  { key: "basic",   label: "기본체",   sample: "안녕하세요 ♡", css: "font-basic" },
  { key: "dunggeun",label: "둥근체",   sample: "안녕하세요 ♡", css: "font-rounded" },
  { key: "soft",    label: "부드러운체", sample: "안녕하세요 ♡", css: "font-soft" },
  { key: "elegant", label: "우아한체",  sample: "안녕하세요 ♡", css: "font-elegant" },
  { key: "modern",  label: "모던체",   sample: "안녕하세요 ♡", css: "font-modern" },
  { key: "warm",    label: "따뜻한체",  sample: "안녕하세요 ♡", css: "font-warm" },
];

const PAPERS = [
  { key: "white",   label: "white" },
  { key: "lavender",label: "lavender" },
  { key: "pink-heart", label: "pink-heart" },
  { key: "sky",     label: "sky" },
  { key: "clover",  label: "clover" },
  { key: "peach",   label: "peach" },
];

// ====== localStorage 유틸 ======
const LS_KEY = "dearly-mailbox";

const loadMailbox = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveMailbox = (box) => {
  localStorage.setItem(LS_KEY, JSON.stringify(box));
};

// D-day 계산 (오늘 기준, 내일이 1)
const calcDday = (openAt) => {
  if (!openAt) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(openAt);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function ComposeForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handle } = useParams(); // 경로에 handle 있을 수도 있어서

  // CircleStage에서 넘긴 친구 정보 (state.recipient)
  const { recipient } = location.state || {};
  const toName = recipient?.name || "친구";
  const toId = recipient?.id || handle || null;
  const isFavoriteTarget = !!recipient?.favorite;

  // ===== 폼 상태 =====
  const [fontKey, setFontKey] = useState("basic");
  const [paperKey, setPaperKey] = useState("white");
  const [body, setBody] = useState("");
  const [openAt, setOpenAt] = useState("");    // yyyy-mm-dd
  const [imageData, setImageData] = useState(null); // base64 or dataURL
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // 헤더에 표시할 제목
  const headerTitle = useMemo(
    () => `${toName}에게 쓰는 편지`,
    [toName]
  );

  const headerSubtitle = useMemo(
    () => `${toName}님에게 전하는 메시지`,
    [toName]
  );

  // 이미지 선택 핸들러 (선택 사항)
  const onSelectImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ===== 봉인 버튼 클릭 =====
  const onSeal = () => {
    if (submitting) return;

    const trimmed = body.trim();
    if (!trimmed) {
      toast.error("편지 내용을 입력해 주세요.");
      return;
    }
    if (!openAt) {
      toast.error("공개 날짜를 선택해 주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const box = loadMailbox();
      const sent = box.sent || [];

      const dday = calcDday(openAt);
      const now = new Date();

      const newLetter = {
        id: Date.now(),              // 유니크 id
        toId,
        toName,
        isFavoriteTarget,           // 즐겨찾기 친구에게 보낸 편지인지
        fontKey,
        paperKey,
        body: trimmed,
        openAt,                     // yyyy-mm-dd
        dday,
        locked: true,               // 아직 안 열린 편지
        image: imageData,           // 선택 안하면 null
        createdAt: now.toISOString().slice(0, 10), // yyyy-mm-dd
        title: `${toName}에게 쓰는 편지`,
      };

      const nextBox = {
        ...box,
        sent: [newLetter, ...sent],
      };

      saveMailbox(nextBox);

      toast.success("편지를 봉인했어요. 수신함 > 보낸편지에서 확인할 수 있어요.");

      // 수신함으로 이동 (보낸편지 탭 우선)
      navigate("/mailbox", {
        replace: true,
        state: { initialTab: "sent" },
      });
    } catch (e) {
      console.error(e);
      toast.error("편지를 저장하는 중 오류가 발생했어요.");
      setSubmitting(false);
    }
  };

  return (
    <div className="compose-screen">
      {/* ===== 헤더 ===== */}
      <header className="wl-compose-header">
        <div className="wl-header-row">
          <button
            type="button"
            className="wl-back-btn"
            onClick={() => navigate(-1)}
            aria-label="이전으로"
          >
            {/* 뒤로가기 아이콘은 기존 svg 그대로 사용 */}
            <span className="wl-back-icon" />
          </button>

          <div className="wl-title-group">
            <h1 className="wl-header-title">{headerTitle}</h1>
            <p className="wl-header-sub">{headerSubtitle}</p>
          </div>
        </div>
      </header>

      {/* ===== 스크롤 영역 ===== */}
      <main className="wl-compose-body">
        {/* 폰트 선택 */}
        <section className="wl-section">
          <h2 className="wl-section-title">폰트 선택</h2>
          <div className="wl-font-grid">
            {FONTS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={
                  "wl-option-card wl-font-card" +
                  (fontKey === f.key ? " wl-option-card--active" : "")
                }
                onClick={() => setFontKey(f.key)}
              >
                <div className="wl-option-label">{f.label}</div>
                <div className={"wl-option-sample " + f.css}>{f.sample}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 편지지 선택 */}
        <section className="wl-section">
          <h2 className="wl-section-title">편지지 선택</h2>
          <div className="wl-paper-grid">
            {PAPERS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={
                  "wl-option-card wl-paper-card" +
                  (paperKey === p.key ? " wl-option-card--active" : "")
                }
                onClick={() => setPaperKey(p.key)}
              >
                <span className="wl-paper-label">{p.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 편지 내용 */}
        <section className="wl-section">
          <h2 className="wl-section-title">편지 내용</h2>
          <div className="wl-textarea-wrap">
            <textarea
              className={`wl-textarea ${"paper-" + paperKey} ${"font-" + fontKey}`}
              placeholder={`${toName}에게 전하고 싶은 말을 적어보세요…`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </section>

        {/* 이미지 선택 (선택 사항) */}
        <section className="wl-section">
          <h2 className="wl-section-title">이미지 (선택)</h2>
          <div className="wl-photo-field">
            <button
              type="button"
              className="wl-photo-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              사진 선택
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onSelectImage}
              style={{ display: "none" }}
            />
            {imageData && (
              <div className="wl-photo-preview">
                <img src={imageData} alt="선택한 이미지 미리보기" />
              </div>
            )}
          </div>
        </section>

        {/* 공개 날짜 */}
        <section className="wl-section">
          <h2 className="wl-section-title">공개 날짜</h2>
          <div className="date-field hoverable no-icon">
            <input
              type="date"
              value={openAt}
              onChange={(e) => setOpenAt(e.target.value)}
            />
          </div>
        </section>

        {/* ===== 봉인 버튼 (페이지 맨 아래, 스크롤되도록) ===== */}
        <div className="wl-seal-wrap">
          <SealButton disabled={submitting} onClick={onSeal} />
        </div>
      </main>
    </div>
  );
}
