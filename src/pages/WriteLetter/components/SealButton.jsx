// src/pages/WriteLetter/components/SealButton.jsx
import React from "react";
import "../styles/seal-button.css";

const SealButton = ({ onClick, disabled = false }) => {
    return (
        <button
            type="button"
            className={`seal-btn ${disabled ? 'is-disabled' : ''}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            aria-label="편지 봉인하기"
        >
            편지 봉인하기
        </button>
    )
}

export default SealButton