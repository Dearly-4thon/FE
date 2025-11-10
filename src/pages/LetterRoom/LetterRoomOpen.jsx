import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./LetterRoomOpen.css";

import backIcon from "../../assets/arrowBack.svg";
import shareIcon from "../../assets/share.svg";
import defaultUserIcon from "../../assets/mailclose.svg";
import downLoadIcon from "../../assets/downLoad.svg";
import copyIcon from "../../assets/copy.svg";
import kakao from "../../assets/Login.svg";

export default function LetterRoomOpen() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const room = {
    title: "지은이 졸업 축하💐",
    isOpen: true,
    dday: 0,
    shareLink: "https://pyeonjibang.com/r/jieun-grad",
    coverImage:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop",
    letters: [
      {
        id: 1,
        writer: "정유나",
        date: "2025. 2. 15.",
        content:
          "지은아 졸업 축하해! 대학 생활 동안 정말 열심히 살았잖아. 앞으로의 인생도 지금처럼 빛나길! 💐",
      },
      { id: 2, writer: "강준호", content: "항상 응원할게!" },
      { id: 3, writer: "민지", content: "너무 고생 많았어 🥰" },
      { id: 4, writer: "지윤", content: "졸업 축하해!!" },
      { id: 5, writer: "수현", content: "항상 행복하자~!" },
      { id: 6, writer: "익명", content: "너 정말 멋있어 😎" },
      { id: 7, writer: "익명", content: "너 정말 멋있어 😎" },
      { id: 8, writer: "익명", content: "너 정말 멋있어 😎" },
      { id: 9, writer: "익명", content: "너 정말 멋있어 😎" },
    ],
  };

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

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLetterClick = (letter) => setSelectedLetter(letter);
  const handleCloseModal = () => setSelectedLetter(null);

  const handleDownloadPDF = () => {
    const target = document.querySelector(".modal-content");
    if (!target) return;

    html2canvas(target, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedLetter.writer}_편지.pdf`);
    });
  };

  const handleShareClick = () => setIsShareOpen(true);
  const handleCloseShare = () => setIsShareOpen(false);
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(room.shareLink);
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
          <span className="open-badge">
            {room.isOpen ? "open" : `D-${room.dday}`}
          </span>
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
            style={{ backgroundImage: `url(${room.coverImage})` }}
          />
          <p className="letter-count center-count">
            편지 {room.letters.length}개
          </p>

          {/* 편지가 없을 때 */}
          {room.letters?.length === 0 && (
          <div className="no-letters">
              <p>아직 편지가 없어요 💌</p>
              <p>첫 편지를 남겨보세요</p>
          </div>
          )}

          {/* 편지 카드 */}
          {room.letters.map((letter, i) => {
            const pos = letterPositions[i];
            return (
              <div
                key={letter.id}
                className="letter-card around"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg)`,
                }}
                onClick={() => handleLetterClick(letter)}
              >
                <img
                  src={defaultUserIcon}
                  alt="편지"
                  className="letter-thumb"
                />
                {!letter.isAnonymous && (
                  <p className="writer-name">{letter.writer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button className="floating-btn">+</button>

      {/* 편지 모달 */}
      {selectedLetter && (
        <div className="letter-modal-overlay" onClick={handleCloseModal}>
          <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedLetter.writer}의 편지</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="modal-content">
              <p className="modal-writer">{selectedLetter.writer}</p>
              <p className="modal-date">{selectedLetter.date}</p>
              <hr />
              <p className="modal-text">{selectedLetter.content}</p>
            </div>

            <button className="pdf-btn" onClick={handleDownloadPDF}>
              <img
                src={downLoadIcon}
                alt="다운로드"
                className="pdf-icon"
              />
              편지를 PDF로 저장
            </button>
          </div>
        </div>
      )}

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
              <p className="share-url">{room.shareLink}</p>
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
