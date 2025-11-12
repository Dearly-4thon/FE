// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

// 페이지들
import LetterRoom from "./pages/LetterRoom/LetterRoomListe.jsx";
import Mailbox from "./pages/Mailbox/Mailbox.jsx";
import MypageMain from "./pages/Mypage/MypageMain.jsx";

// ✔️ 편지쓰기 관련
// 파일이 실제로 존재하는지, 이름/대소문자 맞는지 확인!
import WriteLetterForm from "./pages/WriteLetter/WriteLetterForm.jsx"; 
import ComposeForm from "./pages/WriteLetter/components/ComposeForm.jsx";
import SearchRecipient from "./pages/WriteLetter/components/SearchRecipient.jsx";

import "./styles/overlap.css";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <div className="app-scroll">
          <Routes>
            <Route index element={<Navigate to="/letters" replace />} />

            <Route path="/letters" element={<LetterRoom />} />
            <Route path="/mailbox" element={<Mailbox />} />
            <Route path="/mypage" element={<MypageMain />} />

            {/* ➜ 편지쓰기 진입(폼 틀) */}
            <Route path="/compose" element={<WriteLetterForm />} />
            {/* ➜ 받는 사람 선택 */}
            <Route path="/compose/select" element={<SearchRecipient />} />
            {/* ➜ 실제 작성 폼 (to, name 쿼리/state로 받는 페이지) */}
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
