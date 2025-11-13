// src/App.jsx
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import "./components/Navbar.css";

import Profile from "./pages/Mypage/Profile";
import EditProfile from "./pages/Mypage/EditProfile";
import FriendManagement from "./pages/Mypage/FriendManagement";
import FriendDetail from "./pages/Mypage/FriendDetail";
import Notices from "./pages/Mypage/Notices";
import NoticeDetail from "./pages/Mypage/NoticeDetail";
import Notifications from "./pages/Notification/Notifications";

// 편지방
import LetterRoom from "./pages/LetterRoom/LetterRoom.jsx";
import LetterRoomCreate from "./pages/LetterRoomCreate/LetterRoomCreate.jsx";
import LetterRoomOpen from "./pages/LetterRoom/LetterRoomOpen.jsx";
import LetterRoomLocked from "./pages/LetterRoom/LetterRoomLocked.jsx";

// 로그인 페이지
import Login from "./pages/Login/Login.jsx";
import KakaoCallback from "./pages/SignUp/KakaoCallback.jsx";

// 토큰 확인
import { getAccessToken } from "./api/auth.js";

// 보호 라우트
function RequireAuth() {
  const has = !!getAccessToken();
  const loc = useLocation();
  return has ? <Outlet /> : <Navigate to="/login" replace state={{ from: loc }} />;
}

/* --- 어댑터들 --- */
function ProfilePage() {
  const navigate = useNavigate();
  const handleNavigate = (page, params = {}) => {
    switch (page) {
      case "edit-profile":
        return navigate("/edit-profile");
      case "friend-management":
        return navigate("/friends");
      case "friend-detail":
        return navigate(`/friends/${params.friendId}`);
      case "notices":
        return navigate("/notices");
      case "notice-detail":
        return navigate(`/notices/${params.noticeId}`);
      case "notifications":
        return navigate("/notifications");
      default:
        return navigate("/mypage");
    }
  };
  return (
    <>
      <Profile onNavigate={handleNavigate} />
      <Navbar currentPage="profile" />
    </>
  );
}

function EditProfilePage() {
  const navigate = useNavigate();
  return <EditProfile onNavigate={() => navigate("/mypage")} />;
}

function FriendManagementPage() {
  const navigate = useNavigate();
  const handleNavigate = (page, params = {}) => {
    switch (page) {
      case "profile":
        return navigate("/mypage");
      case "friend-detail":
        return navigate(`/friends/${params.friendId}`);
      default:
        return navigate("/mypage");
    }
  };
  return <FriendManagement onNavigate={handleNavigate} />;
}

function FriendDetailPage() {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    switch (page) {
      case "profile":
        return navigate("/mypage");
      case "friend-management":
        return navigate("/friends");
      default:
        return navigate("/mypage");
    }
  };
  return (
    <>
      <FriendDetail onNavigate={handleNavigate} />
      <Navbar currentPage="profile" />
    </>
  );
}

function NoticesPage() {
  const navigate = useNavigate();
  const handleNavigate = (page, params = {}) => {
    switch (page) {
      case "profile":
        return navigate("/mypage");
      case "notice-detail":
        return navigate(`/notices/${params.noticeId}`);
      default:
        return navigate("/mypage");
    }
  };
  return (
    <>
      <Notices onNavigate={handleNavigate} />
      <Navbar currentPage="profile" />
    </>
  );
}

function NoticeDetailPage() {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    switch (page) {
      case "notices":
        return navigate("/notices");
      default:
        return navigate("/mypage");
    }
  };
  return (
    <>
      <NoticeDetail onNavigate={handleNavigate} />
      <Navbar currentPage="profile" />
    </>
  );
}

function NotificationsPage() {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    switch (page) {
      case "profile":
        return navigate("/mypage");
      case "friend-management":
        return navigate("/friends");
      default:
        return navigate("/mypage");
    }
  };
  return (
    <>
      <Notifications onNavigate={handleNavigate} onBack={() => navigate(-1)} />
      <Navbar currentPage="profile" />
    </>
  );
}

// 편지방 어댑터들
function LetterRoomPage() {
  return (
    <>
      <LetterRoom />
      <Navbar currentPage="letters" />
    </>
  );
}
function LetterRoomCreatePage() {
  return (
    <>
      <LetterRoomCreate />
      <Navbar currentPage="letters" />
    </>
  );
}
function LetterRoomOpenPage() {
  return (
    <>
      <LetterRoomOpen />
      <Navbar currentPage="letters" />
    </>
  );
}
function LetterRoomLockedPage() {
  return (
    <>
      <LetterRoomLocked />
      <Navbar currentPage="letters" />
    </>
  );
}

// 최상위 라우트
export default function App() {
  return (
    <Routes>
      {/* 로그인은 가드 밖 */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

      {/* 보호 라우트: 토큰 없으면 /login으로 */}
      <Route element={<RequireAuth />}>
        {/* 편지방 */}
        <Route path="/letters" element={<LetterRoomPage />} />
        <Route path="/letterroom/create" element={<LetterRoomCreatePage />} />
        <Route path="/letterroom/open/:id" element={<LetterRoomOpenPage />} />
        <Route path="/letterroom/locked/:id" element={<LetterRoomLockedPage />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/friends" element={<FriendManagementPage />} />
        <Route path="/friends/:friendId" element={<FriendDetailPage />} />

        {/* 공지/알림 */}
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 없는 경로는 기본으로 */}
      <Route path="*" element={<Navigate to="/letters" replace />} />
    </Routes>
  );
}
