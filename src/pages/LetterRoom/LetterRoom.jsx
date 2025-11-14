import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LetterRoom.css";
import LetterRoomCard from "./LetterRoomCard.jsx";
import { getMyLetterRooms } from "../../api/LetterRoom.js";

import infoIcon from "../../assets/icons/info.svg";
import sortIcon from "../../assets/icons/sort.svg";
import checkIcon from "../../assets/icons/check.svg";
import mailIcon from "../../assets/icons/mailopen.svg";
import Navbar from "../../components/Navbar.jsx";
import Header from "../../components/Header.jsx";

export default function LetterRoom() {
  const [nickname, setNickname] = useState("");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [letterRooms, setLetterRooms] = useState([]);

  const dropdownRef = useRef(null);
  const tooltipRef = useRef(null);
  const navigate = useNavigate();

  /* -----------------------------
      로그인 사용자 정보 로드
  ----------------------------- */
  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      console.error("❌ user_id 없음 → 재로그인 필요");
      navigate("/login");
      return;
    }

    // nickname이 비어있으면 user_id 사용
    if (storedNickname && storedNickname.trim() !== "") {
      setNickname(storedNickname);
    } else {
      setNickname(storedUserId);
    }
  }, [navigate]);


  /* -----------------------------
      D-day 계산
  ----------------------------- */
  const calculateDday = (openAt) => {
    if (!openAt) return 0;
    const today = new Date();
    const openDate = new Date(openAt);
    const diff = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  /* -----------------------------
      편지방 목록 불러오기 (axios 기반)
  ----------------------------- */
  useEffect(() => {
    const fetchLetterRooms = async () => {
      try {
        const data = await getMyLetterRooms();

        const formattedRooms = data.map((room) => ({
          id: room.id,
          title: room.title,
          coverImage: room.cover_image || "",
          openAt: room.open_at,
          dday: calculateDday(room.open_at),
          isOpen: room.is_open,
          allowAnonymous: room.allow_anonymous ?? false,
          lettersCount: room.letters_count ?? 0,
          ownerNickname: room.owner?.nickname || null,
        }));

        const sortedRooms = [...formattedRooms].sort((a, b) => {
          return sortOrder === "최신순"
            ? new Date(b.openAt) - new Date(a.openAt)
            : new Date(a.openAt) - new Date(b.openAt);
        });

        setLetterRooms(sortedRooms);
      } catch (error) {
        console.error("❌ 편지방 목록 API 에러:", error);
      }
    };

    fetchLetterRooms();
  }, [sortOrder]);

  /* -----------------------------
      정렬
  ----------------------------- */
  const handleSortSelect = (option) => {
    setSortOrder(option);
    setIsDropdownOpen(false);
  };

  const handleCreateClick = () => {
    setIsModalOpen(false);
    navigate("/letterroom/create");
  };

  /* -----------------------------
      편지방 클릭 처리
  ----------------------------- */
  const handleRoomClick = (room) => {
    if (room.dday === 0 || room.isOpen) {
      navigate(`/letterroom/open/${room.id}`);
    } else {
      navigate(`/letterroom/locked/${room.id}`);
    }
  };

  return (
    <>
      <Header />
      <div className="letterroom-container">
        <div className="letterroom-content">
          <h1 className="letterroom-title">
            <span className="nickname">{nickname}</span>님의 편지방
          </h1>

          <div className="letterroom-subtitle">
            <div className="letterroom-left" ref={tooltipRef}>
              <span>디데이에 열리는 특별한 추억</span>
              <img
                src={infoIcon}
                alt="정보"
                className="info-icon"
                onClick={() => setShowTooltip(!showTooltip)}
              />
              {showTooltip && (
                <div className="tooltip-box">
                  <p className="tooltip-title">편지방을 만들어보세요!</p>
                  <p className="tooltip-text">
                    특별한 날을 위한 편지방을 만들고,
                    <br />
                    소중한 사람들과 추억을 나눠보세요 💌
                  </p>
                </div>
              )}
            </div>

            <div className="letterroom-right" ref={dropdownRef}>
              <div className="sort-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src={sortIcon} alt="정렬" className="sort-icon" />
                <span className="sort-text">{sortOrder}</span>
              </div>
              {isDropdownOpen && (
                <div className="sort-dropdown">
                  {["최신순", "오래된순"].map((option) => (
                    <div
                      key={option}
                      className={`sort-option ${sortOrder === option ? "selected" : ""}`}
                      onClick={() => handleSortSelect(option)}
                    >
                      <span>{option}</span>
                      {sortOrder === option && (
                        <img src={checkIcon} alt="선택됨" className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 편지방 없음 */}
          {letterRooms.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">+</div>
              <p className="empty-title">아직 편지방이 없어요</p>
              <p className="empty-sub">첫 편지방을 만들어보세요 ✉️</p>
            </div>
          )}

          {/* 편지방 목록 */}
          {letterRooms.length > 0 && (
            <div className="letterroom-list">
              <div className="letterroom-grid">
                {letterRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    style={{ cursor: "pointer" }}
                  >
                    <LetterRoomCard
                      title={room.title}
                      coverImage={room.coverImage}
                      dday={room.dday}
                      isOpen={room.isOpen}
                      lettersCount={room.lettersCount}
                      allowAnonymous={room.allowAnonymous}
                      ownerNickname={room.ownerNickname}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 플로팅 버튼 */}
        {!isModalOpen && (
          <button className="floating-btn" onClick={() => setIsModalOpen(true)}>
            +
          </button>
        )}
      </div>

      {/* 생성 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="bottom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>무엇을 만들까요?</span>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-item" onClick={handleCreateClick}>
              <div className="modal-icon">
                <img src={mailIcon} alt="편지" />
              </div>
              <div className="modal-text">
                <p className="modal-title">편지방 만들기</p>
                <p className="modal-sub">디데이에 열리는 편지방을 만들어보세요!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar currentPage="letters" />
    </>
  );
}
