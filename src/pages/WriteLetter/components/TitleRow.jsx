import { useEffect, useRef, useState } from "react";
import infoIcon from "../../../assets/icons/info.svg";
import "../styles/title-row.css"; // ✅ 정확한 상대 경로 (한 단계 위로 올라가서 styles 폴더로)

export default function TitleRow({
  title = "누구에게 편지를 쓸까요",
  showQuestion = true,
}) {
  const [openTip, setOpenTip] = useState(false);
  const tipRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (tipRef.current && !tipRef.current.contains(e.target)) {
        setOpenTip(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <div className="wl-title-row">
      <h2 className="wl-title">
        {title}
        {showQuestion && <span className="wl-qmark">?</span>}
      </h2>

      <div className="wl-title-actions" ref={tipRef}>
        <button
          className="wl-info-btn"
          aria-label="도움말"
          onClick={() => setOpenTip((v) => !v)}
        >
          <img src={infoIcon} alt="" width="20" height="20" />
        </button>

        {openTip && (
          <div className="wl-tooltip" role="tooltip">
            <div className="wl-tooltip-card">
              <h3>편지쓰기 가이드 💌</h3>
              <p>
                • 가운데 <span className="self">나</span>를 클릭하면 나에게 편지를 쓸 수 있어요<br />
                • <span className="friend">즐겨찾기 친구</span>를 클릭하면 그 친구에게 편지를 쓸 수 있어요<br />
                • <span className="plus">+ 버튼</span>을 누르면 모든 친구 목록에서 선택할 수 있어요
              </p>
              <span className="wl-tooltip-arrow" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
