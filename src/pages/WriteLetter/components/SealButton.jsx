// src/pages/WriteLetter/components/SealButton.jsx
import React from "react";
import "../styles/compose.css";

export default function SealButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      className="wl-seal-btn"
      disabled={disabled}
      onClick={onClick}
    >
      편지 봉인하기
    </button>
  );
}
