import { useState } from "react";
import PageHeader from "./components/PageHeader.jsx";
import TitleRow from "./components/TitleRow.jsx";
import CircleStage from "./components/CircleStage.jsx";
import ChooserModal from "./components/ChooserModal.jsx";
import "./styles/base.css";

export default function WriteLetterForm() {
  const [showChooser, setShowChooser] = useState(false);

  return (
    <div className="wl-screen">
      {/* 파스텔 하늘 + 종이질감 */}
      <div className="wl-bg" />

      <PageHeader title="편지쓰기" />
      <TitleRow spaced />

      {/* 원형 스테이지 (친구 더미 포함) */}
      <CircleStage demoFriends onClickFab={() => setShowChooser(true)} />

      {/* + 버튼: 절대좌표(상단 684px, 우측 24px) 고정 */}
      <button
        className="wl-fab-abs"
        onClick={() => setShowChooser(true)}
        aria-label="새 편지"
      >
        +
      </button>

      {/* 모달 */}
      {showChooser && <ChooserModal onClose={() => setShowChooser(false)} />}
    </div>
  );
}
