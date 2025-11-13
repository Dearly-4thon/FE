import React from 'react';
import EmptyReceivedMessage from './EmptyReceivedMessage';
// 받은 편지 목록을 위한 LetterItem 컴포넌트가 필요할 경우 여기에 import

const ReceivedLetters = ({ count }) => {
  if (count === 0) {
    return <EmptyReceivedMessage />;
  }


};

export default ReceivedLetters;