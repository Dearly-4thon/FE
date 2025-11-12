// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
// src/App.jsx
import "./styles/overlap.css";


import LetterRoom from "./pages/LetterRoom/LetterRoomListe.jsx";
import WriteLetterForm from "./pages/WriteLetter/WriteLetterForm.jsx";
import Mailbox from "./pages/Mailbox/Mailbox.jsx";
import MypageMain from "./pages/Mypage/MypageMain.jsx";

// ✅ 경로 주의: components 폴더 포함
import ComposeForm from "./pages/WriteLetter/components/ComposeForm.jsx";
import SearchRecipient from "./pages/WriteLetter/components/SearchRecipient.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <div className="app-scroll">
          <Routes>
            <Route index element={<Navigate to="/letters" replace />} />
            <Route path="/letters" element={<LetterRoom />} />
            <Route path="/compose" element={<WriteLetterForm />} />
            <Route path="/compose/form" element={<ComposeForm />} />
            <Route path="/compose/select" element={<SearchRecipient />} />
            <Route path="/compose/form/friend/:handle" element={<ComposeForm />} />
            <Route path="/inbox" element={<Mailbox />} />
            <Route path="/mailbox" element={<Mailbox />} />
            <Route path="/mypage" element={<MypageMain />} />
            <Route path="*" element={<Navigate to="/letters" replace />} />
          </Routes>
          <div className="app-bottom-space" />
        </div>
        <Navbar />
      </div>
    </div>
  );
}
