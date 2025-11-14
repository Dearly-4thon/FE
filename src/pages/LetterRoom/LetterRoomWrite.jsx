// src/pages/LetterRoom/LetterRoomWrite.jsx
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";

export default function LetterRoomWrite() {
  const navigate = useNavigate();

  return (
    <div className="letterroom-write">
      <Header 
        title="편지 쓰기" 
        onBack={() => navigate(-1)}
      />
      <div className="write-content">
        <p>편지방에서 편지 쓰기 페이지</p>
      </div>
    </div>
  );
}