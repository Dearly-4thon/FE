import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LetterRoomOpen.css";

import {
  getLettersInRoom,
  getShareLink,
  getRoomByShareCode,
  deleteLetterRoom,
} from "../../api/LetterRoom.js";

import backIcon from "../../assets/icons/arrowBack.svg";
import shareIcon from "../../assets/icons/share.svg";
import lockIcon from "../../assets/icons/lock.svg";
import defaultUserIcon from "../../assets/icons/mailclose.svg";
import copyIcon from "../../assets/icons/copy.svg";
import kakao from "../../assets/icons/Login.svg";
import moreIcon from "../../assets/icons/more.svg";
import deleteIcon from "../../assets/icons/delete.svg";

export default function LetterRoomLocked() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [letters, setLetters] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleBack = () => navigate("/letters");

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
      편지방 삭제
  ----------------------------- */
  const handleDeleteRoom = async () => {
    try {
      await deleteLetterRoom(id);
      alert("편지방이 삭제되었습니다.");
      navigate("/letters");
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  /* -----------------------------
      데이터 로딩 (axios 기반)
  ----------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) 편지 목록 조회
        const lettersData = await getLettersInRoom(id);
        setLetters(lettersData || []);

        // 2) share-link 조회
        const linkData = await getShareLink(id);
        const shareLink = linkData.share_link;

        // 3) shareCode 추출
        const parts = shareLink.split("/").filter(Boolean);
        const shareCode = parts.pop();

        // 4) 공유코드로 편지방 상세 조회
        const roomData = await getRoomByShareCode(shareCode);

        const dday = calcDday(roomData.open_at);

        setRoom({
          id: roomData.id,
          title: roomData.title,
          isOpen: dday === 0,
          dday,
          coverImage: roomData.cover_image || null,
          shareLink,
        });

        // 잠금 페이지로 이동
        if (dday > 0) {
          navigate(`/letterroom/locked/${id}`);
          return;
        }


      } catch (err) {
        console.error("❌ 편지방 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  /* -----------------------------
      편지 카드 배치 계산 (UI용)
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
      공유 기능
  ----------------------------- */
  const handleCopyLink = async () => {
    if (room?.shareLink) {
      await navigator.clipboard.writeText(room.shareLink);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleKakaoShare = () => {
    alert("카카오톡 공유 기능은 추후 추가 예정입니다!");
  };

  /* -----------------------------
      렌더링
  ----------------------------- */
  if (loading) return <div className="loading">로딩 중...</div>;
  if (!room) return <div>잘못된 접근입니다.</div>;

  return (
    <div className="openroom-container">
      {/* 헤더 */}
      <header className="openroom-header">
        <button className="back-btn" onClick={handleBack}>
          <img src={backIcon} alt="뒤로가기" />
        </button>

        <div className="header-center">
          <h2 className="header-title">{room.title}</h2>
          <span className="open-badge">{`D-${room.dday}`}</span>
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
              <br />삭제된 편지방은 복구할 수 없습니다.
            </p>

            <div className="delete-modal-buttons">
              <button className="confirm-delete" onClick={handleDeleteRoom}>
                삭제
              </button>
              <button className="cancel-delete" onClick={() => setIsDeleteModalOpen(false)}>
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
          >
            {!room.coverImage && (
              <img src={defaultUserIcon} alt="기본 편지지" className="locked-cover-icon" />
            )}
          </div>

          <p className="letter-count center-count">편지 {letters.length}개</p>

          {letters.length === 0 && (
            <div className="no-letters">
              <p>아직 편지가 없어요 💌</p>
              <p>첫 편지를 남겨보세요</p>
            </div>
          )}

          {letters.map((letter, i) => {
            const pos = letterPositions[i];
            const writerName = letter.is_anonymous
              ? "익명"
              : letter.sender?.nickname || "작성자";

            return (
              <div
                key={letter.id}
                className="letter-card around"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg)`,
                }}
              >
                <img src={defaultUserIcon} alt="편지" className="letter-thumb" />
                <img src={lockIcon} alt="잠금" className="lock-overlay" />
                <p className="writer-name">{writerName}</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="locked-bottom-text">
        D-{room.dday}에 편지를 확인할 수 있어요{" "}
        <img src={lockIcon} alt="잠금" className="locked-icon" />
      </p>

      <button 
        className="floating-btn"
        onClick={() => navigate(`/letterroom/${id}/write`)}
      >
        +
      </button>

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
