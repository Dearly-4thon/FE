// src/pages/Compose/Compose.jsx
import React, { useState } from 'react';
import CircleStage from "../WriteLetter/components/CircleStage"; 
import ChooserModal from "../WriteLetter/components/ChooserModal"; 
import InfoModal from "../WriteLetter/components/InfoModal"; // 🚨 InfoModal 가져오기
// import "./styles/Compose.css"; 

export default function Compose() {
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // 🚨 Guide Modal 상태 추가
  
  const handleOpenChooser = () => { setIsChooserOpen(true); };
  const handleCloseChooser = () => { setIsChooserOpen(false); };
  
  // 🚨 Guide Modal 핸들러
  const handleOpenInfoModal = () => { setIsInfoModalOpen(true); };
  const handleCloseInfoModal = () => { setIsInfoModalOpen(false); };

  const handleSelectRecipient = (friend) => {
      // ...
  };

  return (
    <div 
        className="compose-page-layout" 
        style={{ 
            position: 'relative', 
            minHeight: '100vh', 
            width: '100%',
            backgroundColor: '#F0F4F9', 
            overflow: 'hidden' 
        }}
    >
      
      {/* 1. CircleStage 렌더링 */}
      <CircleStage 
        onSelectRecipient={handleSelectRecipient} 
        onClickInfo={handleOpenInfoModal} // 🚨 i 아이콘 클릭 핸들러 전달
        showFab={false} 
        isMailboxMode={false} 
      />
      
      {/* 2. + FAB 버튼 (절대 좌표) */}
      <button 
          className="wl-fab-abs" 
          onClick={handleOpenChooser} 
          aria-label="새 편지 작성"
      >
          +
      </button>

      {/* 3. ChooserModal 렌더링 */}
      {isChooserOpen && <ChooserModal onClose={handleCloseChooser} />}
      
      {/* 🚨 4. InfoModal (가이드 팝업) 렌더링 */}
      {isInfoModalOpen && <InfoModal onClose={handleCloseInfoModal} />}

    </div>
  );
}