import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./LetterRoomOpen.css";

import {
  getLettersInRoom,
  getShareLink,
  getRoomByShareCode,
  deleteLetterRoom,
} from "../../api/LetterRoom.js";

import backIcon from "../../assets/icons/arrowBack.svg";
import shareIcon from "../../assets/icons/share.svg";
import defaultUserIcon from "../../assets/icons/mailclose.svg";
import downLoadIcon from "../../assets/icons/download.svg";
import copyIcon from "../../assets/icons/copy.svg";
import kakao from "../../assets/icons/Login.svg";
import moreIcon from "../../assets/icons/more.svg";
import deleteIcon from "../../assets/icons/delete.svg";

export default function LetterRoomOpen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleBack = () => navigate(-1);

  /* -----------------------------
      D-day 계산
  ----------------------------- */
  const calcDday = (openDate) => {
    if (!openDate) return 0;
    const today = new Date();
    const openAt = new Date(openDate);
    const diff = Math.ceil((openAt - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  /* -----------------------------
      데이터 로딩 (axios 기반 API)
  ----------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) 편지 목록
        const lettersData = await getLettersInRoom(id);
        setLetters(lettersData || []);

        // 2) 공유 링크 조회
        const linkData = await getShareLink(id);
        const shareLink = linkData.share_link;
        const shareCode = shareLink.split("/").pop();

        // 3) 공유코드로 편지방 상세 조회
        const roomData = await getRoomByShareCode(shareCode);

        const dday = calcDday(roomData.open_at);

        // 🔒 공개일 전이면 잠금 페이지로 이동
        if (dday > 0) {
          navigate(`/letterroom/locked/${id}`);
          return;
        }

        setRoom({
          id: roomData.id,
          title: roomData.title,
          isOpen: true,
          dday: 0,
          coverImage: roomData.cover_image || null,
          shareLink,
        });
      } catch (err) {
        console.error("❌ 편지방 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* -----------------------------
      편지방 삭제
  ----------------------------- */
  const handleDeleteRoom = async () => {
    try {
      await deleteLetterRoom(id);
      alert("편지방이 삭제되었습니다.");
      navigate("/letters");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  /* -----------------------------
      편지 카드 배치
  ----------------------------- */
  const generateLetterPositions = (count) => {
    const positions = [];
    const radius = 150;
    const mainCount = Math.min(count, 6);

    for (let i = 0; i < mainCount; i++) {
      const angle = (i / mainCount) * 2 * Math.PI;
      positions.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        rotate: (Math.random() - 0.5) * 10,
      });
    }

    // 7개 이상일 때 위/아래 추가 배치
    if (count > 6) {
      const extraCount = count - 6;
      const gapX = 70;
      const startX = -((Math.min(extraCount, 4) - 1) / 2) * gapX;

      for (let i = 0; i < extraCount; i++) {
        positions.push({
          x: startX + (i % 4) * gapX,
          y: i % 2 === 0 ? -220 : 200,
          rotate: (Math.random() - 0.5) * 5,
        });
      }
    }

    return positions;
  };

  const letterPositions = generateLetterPositions(letters.length);

  /* -----------------------------
      PDF 저장
  ----------------------------- */
  const handleDownloadPDF = () => {
    const target = document.querySelector(".modal-content");
    if (!target) return;

    html2canvas(target, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const writer = selectedLetter?.is_anonymous
        ? "익명"
        : selectedLetter?.sender?.nickname || "작성자";

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${writer}_편지.pdf`);
    });
  };

  /* -----------------------------
      공유 모달
  ----------------------------- */
  const handleCopyLink = async () => {
    if (room?.shareLink) {
      await navigator.clipboard.writeText(room.shareLink);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleKakaoShare = () =>
    alert("카카오톡 공유 기능은 추후 연동 예정입니다!");

  /* -----------------------------
      렌더링
  ----------------------------- */
  if (loading) return <div className="loading">로딩 중...</div>;
  if (!room) return <div>편지방 정보를 불러올 수 없습니다 😢</div>;

  return (
    <div className="openroom-container">
      {/* 헤더 */}
      <header className="openroom-header">
        <button className="back-btn" onClick={handleBack}>
          <img src={backIcon} alt="뒤로가기" />
        </button>

        <div className="header-center">
          <h2 className="header-title">{room.title}</h2>
          <span className="open-badge">open</span>
        </div>

        <div className="header-actions">
          <img
            src={shareIcon}
            alt="공유"
            className="share-icon"
            onClick={() => setIsShareOpen(true)}
          />
          <img
            src={moreIcon}
            alt="더보기"
            className="more-icon"
            onClick={() => setIsMoreOpen((prev) => !prev)}
          />

          {isMoreOpen && (
            <div className="more-menu">
              <button
                className="delete-btn"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setIsMoreOpen(false);
                }}
              >
                <img src={deleteIcon} alt="삭제" className="delete-icon" />
                편지방 삭제
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>편지방 삭제</h3>
            <p>
              이 편지방을 삭제하시겠습니까?
              <br />
              삭제된 편지방은 복구할 수 없습니다.
            </p>

            <div className="delete-modal-buttons">
              <button className="confirm-delete" onClick={handleDeleteRoom}>
                삭제
              </button>
              <button
                className="cancel-delete"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 본문 */}
      <div className="openroom-content">
        <div className="center-wrapper">
          <div
            className="cover-image"
            style={{
              backgroundImage: room.coverImage ? `url(${room.coverImage})` : "none",
              backgroundColor: room.coverImage ? "transparent" : "#fff",
            }}
          />

          <p className="letter-count center-count">편지 {letters.length}개</p>

          {letters.length === 0 && (
            <div className="no-letters">
              <p>아직 편지가 없어요 💌</p>
              <p>첫 편지를 남겨보세요</p>
            </div>
          )}

          {letters.map((letter, i) => {
            const pos = letterPositions[i];
            const writer = letter.is_anonymous
              ? "익명"
              : letter.sender?.nickname || "작성자";

            return (
              <div
                key={letter.id}
                className="letter-card around"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg)`,
                }}
                onClick={() => setSelectedLetter(letter)}
              >
                <img src={defaultUserIcon} alt="편지" className="letter-thumb" />
                <p className="writer-name">{writer}</p>
              </div>
            );
          })}
        </div>
      </div>

      <button className="floating-btn">+</button>

      {/* 편지 모달 */}
      {selectedLetter && (
        <div className="letter-modal-overlay" onClick={() => setSelectedLetter(null)}>
          <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedLetter.is_anonymous
                  ? "익명"
                  : selectedLetter.sender?.nickname}
                의 편지
              </h3>
              <button className="modal-close" onClick={() => setSelectedLetter(null)}>
                ✕
              </button>
            </div>

            <div
              className={`modal-content paper-${
                selectedLetter.paper_theme?.toLowerCase() || "white"
              }`}
            >
              <p className="modal-writer">
                {selectedLetter.is_anonymous
                  ? "익명"
                  : selectedLetter.sender?.nickname}
              </p>

              <p className="modal-date">
                {new Date(selectedLetter.created_at).toLocaleDateString()}
              </p>

              <hr />

              <p
                className={`modal-text font-${
                  selectedLetter.font_style?.toLowerCase() || "basic"
                }`}
              >
                {selectedLetter.content}
              </p>
            </div>

            <button className="pdf-btn" onClick={handleDownloadPDF}>
              <img src={downLoadIcon} alt="다운로드" className="pdf-icon" />
              편지를 PDF로 저장
            </button>
          </div>
        </div>
      )}

      {/* 공유 모달 */}
      {isShareOpen && (
        <div className="share-modal-overlay" onClick={() => setIsShareOpen(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{room.title} 공유하기</h3>
              <button className="modal-close" onClick={() => setIsShareOpen(false)}>
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
