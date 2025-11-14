import React from "react";
import "./LetterRoomCard.css";

export default function LetterRoomCard({
  title = "",
  coverImage = "",
  dday = 0,
  isOpen = false,
  onClick,
}) {
  return (
    <div className="letterroom-card" onClick={onClick}>
      <div className="card-image-wrapper">
        {coverImage ? (
          <img src={coverImage} alt={title} className="card-image" />
        ) : (
          <div className="card-placeholder" />
        )}

        <div className={`card-badge ${isOpen ? "open" : "dday"}`}>
          {isOpen ? "open" : `D-${dday}`}
        </div>
      </div>

      <div className="card-info">
        <p className="card-title">{title}</p>
      </div>
    </div>
  );
}
