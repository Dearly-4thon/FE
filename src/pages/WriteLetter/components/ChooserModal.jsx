// src/pages/WriteLetter/components/ChooserModal.jsx
import { X, Image as ImageIcon, User as UserIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 🚨🚨🚨 이 스타일 파일이 반드시 로드되어야 모달 내용(image_af273e.png)이 보입니다.
import "../styles/chooser-modal.css"; 

export default function ChooserModal({ onClose }) {
  const nav = useNavigate();

  const handleCardClick = (path) => {
    // 먼저 페이지 이동
    nav(path);
    
    // 이동 후 모달 닫기 충돌을 막기 위해 약간 지연
    setTimeout(() => {
        onClose();
    }, 50); 
  };

  return (
    // ... (UI 코드 생략) ...
        <div className="wl-chooser-body">
          <button
            className="wl-chooser-card"
            onClick={() => handleCardClick("/compose/write")} // image_b242fa.png로 이동
          >
            {/* ... */}
          </button>

          <button
            className="wl-chooser-card"
            onClick={() => handleCardClick("/compose/select")}
          >
            {/* ... */}
          </button>
        </div>
    // ...
  );
}