// src/pages/Mailbox/FriendMailboxDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

// image_bd2b9c.png (상대방과의 편지 목록) 화면을 렌더링합니다.
export default function FriendMailboxDetail() {
  const { id } = useParams(); 
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFEF5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
          친구 ID {id}님과의 편지
      </h2>
      {/* image_bd2b9c.png UI 요소 (탭, 편지 목록 등) 구현 */}
    </div>
  );
}