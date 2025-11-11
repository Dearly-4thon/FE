import React from 'react';
import EmptyReceivedMessage from './EmptyReceivedMessage';
// 받은 편지 목록을 위한 LetterItem 컴포넌트가 필요할 경우 여기에 import

const ReceivedLetters = ({ count }) => {
  if (count === 0) {
    return <EmptyReceivedMessage />;
  }

  // 받은 편지 목록이 있을 경우의 렌더링
  return (
    <div className="letter-list">
      {/* <LetterItem key={...} data={...} /> */}
      <p>받은 편지 목록 ({count}개)</p>
    </div>
  );
};

export default ReceivedLetters;