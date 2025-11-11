// src/pages/WriteLetter/components/InfoModal.jsx (새 파일)
import React from 'react';
import { X } from 'lucide-react';

export default function InfoModal({ onClose }) {
  // image_be9c3a.jpg의 가이드 팝업은 
  // i 아이콘의 절대 위치에 맞춰서 위치해야 합니다.
  return (
    <div 
        className="wl-guide-popover"
        style={{
            position: 'absolute',
            top: '100px', // i 아이콘의 위치와 비슷하게 설정
            right: '24px', // 오른쪽 여백
            width: '280px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            border: '1px solid #ddd',
            zIndex: 1000, // 다른 요소보다 위에 표시
        }}
    >
      <button 
          onClick={onClose} 
          style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer' 
          }}
      >
          <X size={18} color="#666" />
      </button>

      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#E91E63' }}>
        편지쓰기 가이드 💖
      </h3>
      <ul style={{ fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
        <li>**가운데** 나를 클릭하면 나에게 편지를 쓸 수 있어요.</li>
        <li>**즐겨찾기 친구**를 클릭하면 그 친구에게 편지를 쓸 수 있어요.</li>
        <li>**'+' 버튼**을 누르면 모든 친구 목록에서 선택할 수 있어요.</li>
      </ul>
    </div>
  );
}