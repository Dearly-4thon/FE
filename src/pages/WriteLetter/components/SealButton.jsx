// src/pages/WriteLetter/components/SealButton.jsx
import React from "react";

/**
 * 아주 단순한 프레젠테이셔널 버튼
 * - 스타일: compose.css의 .submit-button 재사용
 * - 외부 CSS/스토어 임포트 없음
 */
export default function SealButton({ onClick, disabled, label = "편지 봉인하기" }) {
  return (
    <button
      type="button"
      className="submit-button"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
