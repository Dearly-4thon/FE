import React from 'react';
import LetterItem from './LetterItem'; 

// 이미지에 보이는 더미 데이터
const DUMMY_SENT_LETTERS = [
  { 
    id: 1, 
    status: 'opened', 
    title: '민호야 취업 진심으로...', 
    sender: '디어리 올림', 
    date: '2025. 11. 11',
    isLocked: false,
    daysLeft: null
  },
  { 
    id: 2, 
    status: 'locked', 
    title: '2025. 12. 31.에 공개', 
    sender: null, 
    date: '2025. 12. 31',
    isLocked: true,
    daysLeft: 50
  },
  { 
    id: 3, 
    status: 'locked', 
    title: '2025. 12. 31.에 공개', 
    sender: null, 
    date: '2025. 12. 31',
    isLocked: true,
    daysLeft: 50
  },
];

const SentLetters = ({ count }) => {
  if (count === 0) {
    return <p className="no-sent-letters">보낸 편지가 없습니다.</p>;
  }

  return (
    <div className="letter-list sent-list">
      {DUMMY_SENT_LETTERS.map((letter) => (
        <LetterItem key={letter.id} letter={letter} />
      ))}
    </div>
  );
};

export default SentLetters;