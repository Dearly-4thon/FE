// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LetterRoom from "./pages/LetterRoom/LetterRoomListe.jsx";
import WriteLetterForm from "./pages/WriteLetter/WriteLetterForm.jsx";
import Compose from "./pages/Compose/Compose.jsx"; 
import Mailbox from "./pages/Mailbox/Mailbox.jsx";
// Mailbox에서 상세 경로를 렌더링할 컴포넌트 추가 가정
import SelfMailboxDetail from "./pages/Mailbox/SelfMailboxDetail.jsx"; // image_bd2b63.png
import FriendMailboxDetail from "./pages/Mailbox/FriendMailboxDetail.jsx"; // image_bd2b9c.png

export default function App() {
  return (
    <div
      className="app-shell"
      style={{
        maxWidth: "393px", 
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <Navbar /> 
      <Routes>
        <Route index element={<Navigate to="/letters" replace />} />
        <Route path="/letters" element={<LetterRoom />} />
        
        {/* 수신함 메인: initialTab="received"로 기본 탭 활성화 */}
        <Route path="/inbox" element={<Mailbox initialTab="received" />} /> 
        
        {/* ✨ 수정: 본인 편지함 상세 경로 (image_bd2b63.png) */}
        <Route path="/inbox/self" element={<SelfMailboxDetail />} />
        
        {/* ✨ 수정: 상대방 편지함 상세 경로 (image_bd2b9c.png) */}
        <Route path="/inbox/friend/:id" element={<FriendMailboxDetail />} />

        <Route path="/compose" element={<Compose />} />
        <Route path="/compose/write" element={<WriteLetterForm />} />
        <Route path="*" element={<Navigate to="/letters" replace />} />
      </Routes>
    </div>
  );
}