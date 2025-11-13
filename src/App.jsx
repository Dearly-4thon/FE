// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import "./styles/overlap.css";

// 페이지
import WriteLetterForm from "./pages/WriteLetter/WriteLetterForm.jsx";
import ComposeForm from "./pages/WriteLetter/components/ComposeForm.jsx";
import Mailbox from "./pages/Mailbox/Mailbox.jsx";
import MypageMain from "./pages/Mypage/MypageMain.jsx";
import LetterRoom from "./pages/LetterRoom/LetterRoomListe.jsx";
import SearchRecipient from "./pages/WriteLetter/components/SearchRecipient.jsx";
import MailboxTabs from "./pages/Mailbox/components/MailboxTab.jsx";
import CenterHub from "./pages/Mailbox/components/CenterHub.jsx";
import FriendConversation from "./pages/Mailbox/components/FriendConversation.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <div className="app-scroll">
          <Routes>
            {/* 기본 경로는 편지방으로 */}
            <Route index element={<Navigate to="/letters" />} />

            {/* 편지방 */}
            <Route path="/letters" element={<LetterRoom />} />

            {/* ✅ 편지쓰기 메인(지금 캡쳐한 CircleStage 화면) */}
            <Route path="/write" element={<WriteLetterForm />} />
            <Route path="/write/compose/:handle" element={<ComposeForm />} />

            {/* 받는 사람 검색 */}
            <Route path="/write/search" element={<SearchRecipient />} />

            {/* ✅ 편지지 고르고 내용 쓰는 화면 */}
            <Route path="/write/compose" element={<ComposeForm />} />

            {/* 수신함 */}
            <Route path="/mailbox" element={<Mailbox />} />
            <Route path="/mailbox/:friends" element={<FriendConversation />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<MypageMain />} />

            <Route path="*" element={<Navigate to="/letters" replace />} />
          </Routes>
        </div>

        <Navbar />
      </div>
    </div>
  );
}
