// src/pages/Mailbox/components/SentLetters.jsx
import React, { useMemo } from "react";
import "../../WriteLetter/styles/compose.css";
import "../../../styles/fonts.css";
import "../styles/sent.css";

const LS_KEY = "dearly-mailbox";
const loadMailbox = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
};

const FONT_FAMILIES = {
  basic: '"Noto Sans KR", sans-serif',
  dunggeun: '"Cafe24Surround", sans-serif',
  soft: '"OngleipParkDahyeon", cursive',
  elegant: '"JoseonGulim", serif',
  modern: '"Suit", sans-serif',
  warm: '"GowoonDodum", sans-serif',
};
const FONT_CLASS = {
  basic: "font-basic",
  dunggeun: "font-rounded",
  soft: "font-soft",
  elegant: "font-elegant",
  modern: "font-modern",
  warm: "font-warm",
};



export default function SentLetters() {
  const sent = useMemo(() => loadMailbox().sent || [], []);

  if (!sent.length) {
    return <p className="empty">아직 보낸 편지가 없어요.</p>;
  }

  return (
    <ul className="sent-list">
      {sent.map((item) => {
        // 화면에 찍을 "To. ~" 문구
        const toLabel =
          item.toLabel ||
          (item.to === "나" ? "나에게" : `${item.to}에게`);

        return (
          <li key={item.id} className="sent-item">
            <div className="sent-row">
              <div className="sent-meta">
                <div className="sent-to">To. {toLabel}</div>

                <div
                  className={`sent-title ${
                    FONT_CLASS[item.font] || "font-basic"
                  }`}
                  style={{
                    fontFamily:
                      FONT_FAMILIES[item.font] || FONT_FAMILIES.basic,
                  }}
                  title={item.title}
                >
                  {item.title}
                </div>
              </div>

              <div className="sent-date">D-DAY {item.openAt}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
