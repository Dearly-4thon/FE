import React from 'react';

const InfoModal = ({ onClose }) => {
  return (
    // 배경을 클릭하면 모달이 닫히도록 설정
    <div className="info-modal-backdrop" onClick={onClose}>
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 모달 내용 */}
        <ul>
          <li>가운데 나를 클릭하면 나에게 쓴 편지를 볼 수 있어요.</li>
          <li>즐겨찾기 친구를 클릭하면 서로 주고받은 편지를 확인할 수 있어요.</li>
          <li>하단 받은편지/보낸편지에서 모든 편지 기록을 볼 수 있어요.</li>
        </ul>
        {/* 닫기 버튼은 UX를 위해 생략하고 배경 클릭으로 대체 */}
      </div>
    </div>
  );
};

export default InfoModal;