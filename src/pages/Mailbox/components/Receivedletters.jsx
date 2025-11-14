import React, { useState, useEffect } from 'react';
import { getInbox } from "../../../api/mailbox";
import EmptyReceivedMessage from './EmptyReceivedMessage';
import '../styles/received-letters.css'; // 받은편지 전용 CSS

const ReceivedLetters = () => {
  console.log("✅ ReceivedLetters 컴포넌트 로드됨!");
  
  // 올바른 목업 데이터 (백엔드 API 형식에 맞춰서)
  const [received] = useState([
    {
      id: 1,
      title: "안녕하세요! 처음 편지예요",
      sender: "친구A",
      isLocked: false, // 이미 공개된 편지
      openDate: "2024.12.10",
      daysLeft: 0,
      content: "안녕하세요! 처음으로 편지를 보내봅니다. 잘 부탁드려요!"
    },
    {
      id: 2,
      title: "", // 잠긴 편지는 제목도 보이면 안됨
      sender: "산타",
      isLocked: true, // 아직 공개 안된 편지
      openDate: "2024.12.25",
      daysLeft: 11,
      content: "" // 잠긴 편지는 내용도 보이면 안됨
    },
    {
      id: 3,
      title: "", 
      sender: "엄마",
      isLocked: true,
      openDate: "2025.01.01",
      daysLeft: 18,
      content: ""
    }
  ]);
  
  console.log("📝 받은편지 데이터:", received.length, "개");

  // 편지 상세 모달 상태
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  // 편지 클릭 핸들러
  const handleLetterClick = (letter) => {
    if (!letter.isLocked) {
      setSelectedLetter(letter);
    }
  };
  
  // 모달 닫기
  const closeModal = () => {
    setSelectedLetter(null);
  };

  // 편지 목록 렌더링
  return (
    <>
      <div className="received-list">
        {received.map((letter) => (
          <div 
            key={letter.id} 
            className={`letter-card ${letter.isLocked ? 'locked' : 'opened'}`}
            onClick={() => handleLetterClick(letter)}
            style={{ cursor: letter.isLocked ? 'default' : 'pointer' }}
          >
          {letter.isLocked ? (
            // 잠긴 편지 UI - 내용 완전 숨김
            <div className="locked-content">
              <div className="lock-header">
                <span className="sender-name">From. {letter.sender}</span>
                <span className="d-day">D-{letter.daysLeft}</span>
              </div>
              
              <div className="lock-center">
                <div className="lock-icon">🔒</div>
                <div className="lock-message">
                  <p className="lock-main-text">비공개 상태</p>
                  <p className="lock-sub-text">{letter.openDate}에 공개됩니다</p>
                </div>
              </div>
            </div>
          ) : (
            // 공개된 편지 UI
            <div className="opened-content">
              <div className="letter-header">
                <span className="sender-name">From. {letter.sender}</span>
                <span className="open-date">{letter.openDate}</span>
              </div>
              <div className="letter-preview">
                <h3 className="letter-title">{letter.title}</h3>
                <p className="letter-excerpt">{letter.content?.slice(0, 50)}...</p>
              </div>
            </div>
          )}
          </div>
        ))}
      </div>

      {/* 편지 상세 모달 */}
      {selectedLetter && (
        <div className="letter-modal-overlay" onClick={closeModal}>
          <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2 className="modal-title">디어리의 편지</h2>
            </div>
            
            <div className="modal-content">
              <div className="letter-paper">
                <div className="paper-header">
                  <span className="paper-sender">디어리</span>
                  <span className="paper-date">2025. 1. 8.</span>
                </div>
                <div className="paper-divider"></div>
                <div className="paper-body">
                  {selectedLetter.content}
                </div>
              </div>
              
              <button className="pdf-download-btn">
                📥 편지를 PDF로 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceivedLetters;