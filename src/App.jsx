// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

// 페이지들
import LetterRoom from "./pages/LetterRoom/LetterRoomListe.jsx";
import Mailbox from "./pages/Mailbox/Mailbox.jsx";
import MypageMain from "./pages/Mypage/MypageMain.jsx";

// ✔️ 편지쓰기 관련
import WriteLetterForm from "./pages/WriteLetter/WriteLetterForm.jsx";
import ComposeForm from "./pages/WriteLetter/components/ComposeForm.jsx";
import SearchRecipient from "./pages/WriteLetter/components/SearchRecipient.jsx";
import SentToMePage from "./pages/Mailbox/components/SentTomePage.jsx";

// ✔️ 수신함 친구/나와의 편지 화면
import FriendConversation from "./pages/Mailbox/components/FriendConversation.jsx";

import "./styles/overlap.css";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <div className="app-scroll">
          <Routes>
            {/* 기본: 편지방 */}
            <Route index element={<Navigate to="/letters" replace />} />

            {/* 편지방 / 수신함 / 마이페이지 */}
            <Route path="/letters" element={<LetterRoom />} />
            <Route path="/mailbox" element={<Mailbox />} />
            <Route path="/mypage" element={<MypageMain />} />

            {/* ✅ 수신함 - 친구/나와의 편지 화면 */}
            <Route
              path="/mailbox/conversation/:friendId"
              element={<FriendConversation />}
            />
            <Route path="/mailbox/self" element={<SentToMePage />} />


            {/* ➜ 편지쓰기 진입(폼 틀) */}
            <Route path="/compose" element={<WriteLetterForm />} />
            {/* ➜ 받는 사람 선택 */}
            <Route path="/compose/select" element={<SearchRecipient />} />
            {/* ➜ 실제 작성 폼 */}
            <Route path="/compose/form" element={<ComposeForm />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/letters" replace />} />
          </Routes>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
