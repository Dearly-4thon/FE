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

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <div className="app-scroll">
          <Routes>
            {/* 기본 경로: / → /letters */}
            <Route path="/" element={<Navigate to="/letters" replace />} />

            {/* 편지방 (프로필 카드들 있는 메인) */}
            <Route path="/letters" element={<LetterRoom />} />

            {/* 편지쓰기 메인 (CircleStage 있는 화면) */}
            <Route path="/write" element={<WriteLetterForm />} />

            {/* 받는 사람 검색 */}
            <Route path="/write/search" element={<SearchRecipient />} />

            {/* 편지지 + 내용 쓰는 화면 (handle 유무 둘 다 ComposeForm으로) */}
            <Route path="/write/compose" element={<ComposeForm />} />
            <Route path="/write/compose/:handle" element={<ComposeForm />} />

            {/* 수신함 메인 */}
            <Route path="/mailbox" element={<Mailbox />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<MypageMain />} />

            {/* 그 외 잡다한 주소는 전부 편지방으로 */}
            <Route path="*" element={<Navigate to="/letters" replace />} />
          </Routes>
        </div>

        {/* 항상 하단에 떠 있는 네비게이션 */}
        <Navbar />
      </div>
    </div>
  );
}
