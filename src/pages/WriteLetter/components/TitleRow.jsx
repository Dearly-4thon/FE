import { useState } from "react";
import { Info } from "lucide-react";
import "../styles/title-row.css";

export default function TitleRow({
    title = "누구에게 편지를 쓸까요",
    spaced = false,
    showQuestion = true,
}) {
    const [openTip, setOpenTip] = useState(false);

    return (
        <div className={`wl-title-row ${spaced ? "wl-title-spaced" : ""}`}>
            <h1 className="wl-title">
                {title} {showQuestion && <span className="wl-q">?</span>}
            </h1>

            <button
                className="wl-info-btn"
                onClick={() => setOpenTip((v) => !v)}
                aria-label="도움말"
                type="button"
            >
                <Info className="wl-info-plain" />
            </button>

            {openTip && (
                <div className="wl-tooltip" role="tooltip">
                    <div className="wl-tooltip-card">
                        <h3>편지쓰기 가이드</h3>
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
    );
}
