// src/pages/Mailbox/components/SentLetters.jsx
import React, { useMemo } from "react";

// 전역 폰트 유틸 (fonts.css가 main.jsx 또는 여기에서 한 번만 import 되면 됨)
import "../../../styles/fonts.css";

// 보낸편지 전용 스타일
import "../styles/sent.css";

const LS_KEY = "dearly-mailbox";
const loadMailbox = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
};

const FONT_CLASS = {
  basic: "font-basic",
  dunggeun: "font-rounded",
  soft: "font-soft",
  elegant: "font-elegant",
  modern: "font-modern",
  warm: "font-warm",
};
const FONT_FAMILY = {
  basic: '"Noto Sans KR", sans-serif',
  dunggeun: '"Cafe24Surround", sans-serif',
  soft: '"OngleipParkDahyeon", cursive',
  elegant: '"JoseonGulim", serif',
  modern: '"Suit", sans-serif',
  warm: '"GowoonDodum", sans-serif',
};

// 날짜: D-Day 계산 & 출력용 유틸
const toDate = (s) => {
  // "YYYY-MM-DD" or "YYYY. MM. DD" 대응
  if (!s) return null;
  const t = s.replaceAll(".", "-").replace(/\s/g, "");
  const d = new Date(t);
  return isNaN(d) ? null : d;
};
const fmtDot = (s) => {
  const d = toDate(s);
  if (!d) return s || "";
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}. ${m}. ${day}.`;
};
const ddayOf = (s) => {
  const d = toDate(s);
  if (!d) return null;
  const today = new Date();
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  const diff = Math.floor((d - today) / (1000*60*60*24));
  return diff; // >0 D-?, =0 D-day, <0 opened
};

const [count, setCount] = useState(() => {
  const arr = JSON.parse(localStorage.getItem("dearly:sentLetters") || "[]");
  return arr.length;
});

useEffect(() => {
  const onSent = (e) => setCount(e?.detail?.count ?? (c => c + 1));
  window.addEventListener("letter:sent", onSent);
  return () => window.removeEventListener("letter:sent", onSent);
}, []);

export default function SentLetters() {
  const sent = useMemo(() => (loadMailbox().sent || []), []);

  if (!sent.length) return <p className="empty" style={{padding:"24px"}}>아직 보낸 편지가 없어요.</p>;

  return (
    <div className="sent-wrap">
      <ul className="sent-list">
        {sent.map((m) => {
          const d = ddayOf(m.openAt);
          const lock = d === null ? false : d >= 0;
          const ddayText = d === null ? null : (d > 0 ? `D-${d}` : d === 0 ? "D-DAY" : "OPEN");

          return (
            <li key={m.id} className="sent-card">
              {/* 썸네일: 현재 로컬 구조상 파일 이름만 있으므로 플레이스홀더 */}
              <div className="sent-thumb">
                {/* 이미지 URL이 있다면 이곳에 <img src="..." /> */}
              </div>

              <div className="sent-body">
                <div className="sent-top">
                  <div className="sent-to">To. {m.to}</div>
                  <div className="sent-date">{fmtDot(m.openAt)}</div>
                </div>

                <div
                  className={`sent-title ${FONT_CLASS[m.font] || "font-basic"}`}
                  style={{ fontFamily: FONT_FAMILY[m.font] || FONT_FAMILY.basic }}
                  title={m.title}
                >
                  {m.title}
                </div>

                <div className="sent-badges">
                  {ddayText && <span className="badge badge-dday">{ddayText}</span>}
                  {lock && <span className="badge locked">잠김</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
