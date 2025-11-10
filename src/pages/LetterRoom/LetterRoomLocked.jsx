import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./LetterRoomOpen.css";

import backIcon from "../../assets/arrowBack.svg";
import shareIcon from "../../assets/share.svg";
import lockIcon from "../../assets/lock.svg";
import defaultUserIcon from "../../assets/mailclose.svg";
import copyIcon from "../../assets/copy.svg";
import kakao from "../../assets/Login.svg";

export default function LetterRoomLocked() {
  const navigate = useNavigate();
  // const location = useLocation();
//   const room = location.state; 
  const room = {
    title: "힐링타임 🌿",
    isOpen: true,
    dday: 0,
    coverImage:
      "https://images.unsplash.com/photo-1607968565043-36a2f6b2f57c?w=800&h=600&fit=crop",
    letters: [],
  };


  if (!room) return <div>잘못된 접근입니다.</div>;

  const handleBack = () => navigate(-1);

  const generateLetterPositions = (count) => {
    const positions = [];
    const radius = 150; 

    const mainCount = Math.min(count, 6);
    for (let i = 0; i < mainCount; i++) {
      const angle = (i / mainCount) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const rotate = (Math.random() - 0.5) * 10;
      positions.push({ x, y, rotate });
    }

    if (count > 6) {
      const extraCount = count - 6;
      const gapX = 70; 
      const startX = -((Math.min(extraCount, 4) - 1) / 2) * gapX;

      for (let i = 0; i < extraCount; i++) {
        const isTop = i % 2 === 0; 
        const x = startX + (i % 4) * gapX; 
        const y = isTop ? -220 : 200; 
        const rotate = (Math.random() - 0.5) * 5;
        positions.push({ x, y, rotate });
      }
    }
    return positions;
  };

  const letterPositions = generateLetterPositions(room.letters?.length || 0);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const handleShareClick = () => setIsShareOpen(true);
  const handleCloseShare = () => setIsShareOpen(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(room.shareLink || window.location.href);
  };
  const handleKakaoShare = () => {
    alert("카카오톡 공유 기능은 추후 연동 예정입니다!");
  };

  return (
    <div className="openroom-container">
      <header className="openroom-header">
        <button className="back-btn" onClick={handleBack}>
          <img src={backIcon} alt="뒤로가기" />
        </button>

        <div className="header-center">
          <h2 className="header-title">{room.title}</h2>
          <span className="open-badge">{`D-${room.dday}`}</span>
        </div>

        <img
          src={shareIcon}
          alt="공유"
          className="share-icon"
          onClick={handleShareClick}
        />
      </header>

      <div className="openroom-content">
        <div className="center-wrapper">
          <div
            className="cover-image"
            style={{
              backgroundImage: room.coverImage
                ? `url(${room.coverImage})`
                : "none",
              backgroundColor: room.coverImage ? "transparent" : "#fff",
            }}
          >
            {!room.coverImage && (
              <img
                src={defaultUserIcon}
                alt="기본 편지지"
                className="locked-cover-icon"
              />
            )}
          </div>

          <p className="letter-count center-count">
            편지 {room.letters?.length || 0}개
          </p>

          {/* 편지가 없을 때 */}
          {room.letters?.length === 0 && (
          <div className="no-letters">
              <p>아직 편지가 없어요 💌</p>
              <p>첫 편지를 남겨보세요</p>
          </div>
          )}


          {/* 주변 편지들 */}
          {room.letters?.map((letter, i) => {
            const pos = letterPositions[i];
            return (
              <div
                key={letter.id}
                className="letter-card around"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg)`,
                }}
              >
                <img
                  src={defaultUserIcon}
                  alt="편지"
                  className="letter-thumb"
                />
                <img src={lockIcon} alt="잠금" className="lock-overlay" />
                <p className="writer-name">{letter.writer}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 디데이 안내 */}
      <p className="locked-bottom-text">
        D-{room.dday}에 편지를 확인할 수 있어요{" "}
        <img src={lockIcon} alt="잠금" className="locked-icon" />
      </p>

      <button className="floating-btn">+</button>

      {/* 공유 모달 */}
      {isShareOpen && (
        <div className="share-modal-overlay" onClick={handleCloseShare}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{room.title} 공유하기</h3>
              <button className="modal-close" onClick={handleCloseShare}>
                ✕
              </button>
            </div>

            <p className="share-subtext">친구들을 편지방에 초대해보세요</p>

            <div className="share-link-box">
              <p className="share-label">공유 링크</p>
              <p className="share-url">{room.shareLink || window.location.href}</p>
            </div>

            <button className="share-copy-btn" onClick={handleCopyLink}>
              <img src={copyIcon} alt="복사" className="share-icon-btn" />
              링크 복사하기
            </button>

            <button className="share-kakao-btn" onClick={handleKakaoShare}>
              <img src={kakao} alt="카카오" className="share-icon-btn" />
              카카오톡으로 공유하기
            </button>

            <p className="share-hint">
              링크를 받은 친구들이 편지방에 참여할 수 있어요 ✉️
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
