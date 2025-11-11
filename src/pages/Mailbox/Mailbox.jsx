// src/pages/Mailbox/Mailbox.jsx (수정된 최종 버전)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './styles/Mailbox.css'; // CSS 파일 로드 확인
import MailboxHeader from './components/MailboxHeader'; 
import MailboxTab from './components/MailboxTab';
import ReceivedLetters from './components/ReceivedLetters';
import SentLetters from './components/SentLetters';
import CircleStage from "../WriteLetter/components/CircleStage.jsx"; 
import InfoModal from "../WriteLetter/components/InfoModal"; // 가이드 모달 재사용

const Mailbox = ({ initialTab }) => { 
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab || 'received'); 
  const [counts] = useState({ receivedCount: 0, sentCount: 3 });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // i 아이콘 모달 상태 추가

  useEffect(() => { setActiveTab(initialTab || 'received'); }, [initialTab]);
  
  const handleTabChange = (tab) => { setActiveTab(tab); };
  
  const handleProfileClick = (friend) => {
      if (friend.isSelf) { 
          nav("/inbox/self"); 
      } else { 
          nav(`/inbox/friend/${friend.id}`); 
      }
  };

  const handleOpenInfoModal = () => { setIsInfoModalOpen(true); };
  const handleCloseInfoModal = () => { setIsInfoModalOpen(false); };


  return (
    <div 
        className="mailbox-container"
        style={{ 
            backgroundColor: '#FFFEF5', // image_bd2838.png 배경색
            minHeight: '100vh', 
            paddingBottom: '60px', 
            overflowY: 'scroll', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none' 
        }}
    >
      {/* 1. 상단 Dearly 로고 및 알림 (MailboxHeader에서 처리) */}
      <MailboxHeader /> 

      {/* 2. 원형 친구 배치 영역 (CircleStage) */}
      <div 
        className="profile-chart-area" 
        style={{ 
            padding: '20px 0',
            marginTop: '-20px', 
            marginBottom: '40px', // 탭과의 간격 확보
        }} 
      >
        <CircleStage 
            onSelectRecipient={handleProfileClick} 
            onClickInfo={handleOpenInfoModal} // i 아이콘 클릭 연결
            showFab={false} 
            isMailboxMode={true} // Mailbox 전용 UI (제목/부제목) 표시
        />
      </div>
      
      {/* 🚨🚨🚨 상단 중복 UI 제거 완료. 하단 탭과 목록만 렌더링합니다. 🚨🚨🚨 */}

      {/* 3. 받은 편지/보낸 편지 탭 (하단) */}
      <div className="mailbox-tab-wrapper" style={{ padding: '0 20px' }}>
          <MailboxTab
            activeTab={activeTab}
            onTabChange={handleTabChange}
            receivedCount={counts.receivedCount}
            sentCount={counts.sentCount}
          />
      </div>
      
      {/* 4. 탭 내용 영역 */}
      <div className="mailbox-content" style={{ padding: '20px' }}>
        {activeTab === 'received' ? (
          <ReceivedLetters count={counts.receivedCount} />
        ) : (
          <SentLetters count={counts.sentCount} />
        )}
      </div>

      {/* 5. Info Modal 렌더링 (Mailbox 모드에 맞춰 위치 조정 필요) */}
      {isInfoModalOpen && (
        // InfoModal은 Compose용 위치로 설정되어 있어, Mailbox용 위치로 조정 필요
        <InfoModal 
            onClose={handleCloseInfoModal} 
            isMailboxMode={true} // Mailbox 모드임을 알림
        />
      )}
      
      <style>{`.mailbox-container::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default Mailbox;