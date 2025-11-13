import React from 'react';
import { Lock, Clock, Mail } from 'lucide-react';

const LetterItem = ({ letter }) => {
  const { title, sender, isLocked, daysLeft, date } = letter;

  return (
    <div className={`letter-card ${isLocked ? 'locked' : 'opened'}`}>
      {isLocked ? (
        // 잠긴 편지 UI
        <div className="locked-content">
          <div className="lock-header">
            <Clock size={16} className="clock-icon" />
            <span className="d-day">D-{daysLeft}</span>
          </div>
          <div className="lock-icon-group">
            <Lock size={32} className="lock-icon" />
            <Mail size={32} className="mail-icon" />
          </div>
          <p className="open-date">{date}에 공개</p>
        </div>
      ) : (
        // 공개된(작성된) 편지 UI
        <div className="opened-content">
          <p className="letter-title">{title}</p>
          <span className="letter-sender">{sender}</span>
        </div>
      )}
    </div>
  );
};

export default LetterItem;