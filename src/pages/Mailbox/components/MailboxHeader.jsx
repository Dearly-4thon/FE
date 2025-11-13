// src/pages/Mailbox/components/MailboxHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/MailboxHeader.css";
import infoIcon from "../../../assets/info.svg";   // 진짜 svg

export default function MailboxHeader() {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  // 바깥 클릭 + ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="mbx-header">
      <div className="mbx-title-row">
        <h2 className="mbx-title">누구의 편지를 볼까요?</h2>

        <div className="mbx-info-wrap">
          <button
            type="button"
            className="mbx-info-btn"
            aria-label="편지함 가이드 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <img src={infoIcon} alt="정보" className="mbx-info-icon" />
          </button>

          {open && (
            <div
              ref={popRef}
              className="mbx-popover"
              role="dialog"
              aria-label="편지함 가이드"
            >
              <div className="mbx-popover-arrow" />
              <h3 className="mbx-popover-title">편지함 가이드 💌</h3>
              <ul className="mbx-popover-list">
                <li>
                  • 가운데{" "}
                  <span className="mbx-em me">나</span>를 클릭하면 나에게 쓴 편지를
                  읽을 수 있어요
                </li>
                <li>
                  • <span className="mbx-em fav">즐겨찾기 친구</span>를 클릭하면
                  서로 주고받은 편지를 확인할 수 있어요
                </li>
                <li>
                  • 하단{" "}
                  <span className="mbx-em pink">받은편지/보낸편지</span>에서 모든
                  편지 현황을 볼 수 있어요
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="mbx-subtitle">
        프로필을 선택해서 주고받은 편지를 확인해보세요
      </p>
    </header>
  );
}
