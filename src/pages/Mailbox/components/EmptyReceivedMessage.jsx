// components/EmptyReceivedMessage.jsx
import React from 'react';

const EmptyReceivedMessage = () => {
  return (
    <div className="empty-message-box">
      <div className="envelope-icon">💌</div>
      <p className="main-text">아직 받은 편지가 없어요.</p>
      <p className="sub-text">친구들과 편지방 만들어보세요!</p>
    </div>
  );
};

export default EmptyReceivedMessage;