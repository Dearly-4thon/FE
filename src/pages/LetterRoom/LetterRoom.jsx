import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LetterRoom.css";
import LetterRoomCard from "./LetterRoomCard.jsx";

import infoIcon from "../../assets/info.svg";
import sortIcon from "../../assets/sort.svg";
import checkIcon from "../../assets/check.svg";
import mailIcon from "../../assets/mailopen.svg";

export default function LetterRoom() {
  const [nickname, setNickname] = useState("Dearly");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const tooltipRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);

    const handleClickOutside = (e) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(e.target)) &&
        (tooltipRef.current && !tooltipRef.current.contains(e.target))
      ) {
        setIsDropdownOpen(false);
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortClick = () => setIsDropdownOpen(!isDropdownOpen);
  const handleSortSelect = (option) => {
    setSortOrder(option);
    setIsDropdownOpen(false);
  };
  const toggleTooltip = () => setShowTooltip(!showTooltip);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setIsModalOpen(false);
    }
  };

  const handleCreateClick = () => {
    setIsModalOpen(false);
    navigate("/letterroom/create");
  };

  // 더미 데이터
  const [letterRooms, setLetterRooms] = useState([
    {
      id: 1,
      title: "생일 축하 편지방 🎂",
      coverImage: "",
      dday: 5,
      isOpen: false,
    },
    {
      id: 2,
      title: "연말 편지방 🎄",
      coverImage:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop",
      dday: 0,
      isOpen: true,
    },
    {
      id: 3,
      title: "졸업 축하 💐",
      coverImage:
        "https://images.unsplash.com/photo-1608889173111-1f0e34192b8a?w=800&h=600&fit=crop",
      dday: 12,
      isOpen: false,
    },
  ]);

  // 카드 클릭 시 상세 페이지 이동
  const handleRoomClick = (room) => {
    if (room.dday === 0 || room.isOpen) {
      navigate(`/letterroom/open/${room.id}`, { state: room }); 
    } else {
      navigate(`/letterroom/locked/${room.id}`, { state: room });
    }
  };


  return (
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
              onClick={toggleTooltip}
            />
            {showTooltip && (
              <div className="tooltip-box">
                <p className="tooltip-title">편지방을 만들어보세요!</p>
                <p className="tooltip-text">
                  특별한 날을 위한 편지방을 만들고,
                  <br />
                  소중한 사람들과 추억을 나눠보세요 🪧
                </p>
              </div>
            )}
          </div>

          <div className="letterroom-right" ref={dropdownRef}>
            <div className="sort-toggle" onClick={handleSortClick}>
              <img src={sortIcon} alt="정렬" className="sort-icon" />
              <span className="sort-text">{sortOrder}</span>
            </div>

            {isDropdownOpen && (
              <div className="sort-dropdown">
                {["최신순", "오래된순"].map((option) => (
                  <div
                    key={option}
                    className={`sort-option ${
                      sortOrder === option ? "selected" : ""
                    }`}
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
            <p className="empty-sub">첫 편지방을 만들어보세요 🪧</p>
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
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isModalOpen && (
        <button className="floating-btn" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      )}

      {/* 하단 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="bottom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>무엇을 만들까요?</span>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-item" onClick={handleCreateClick}>
              <div className="modal-icon">
                <img src={mailIcon} alt="편지" />
              </div>
              <div className="modal-text">
                <p className="modal-title">편지방 만들기</p>
                <p className="modal-sub">
                  디데이에 열리는 편지방을 만들어보세요!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
