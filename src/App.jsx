import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/SignUp/SignUp.jsx";
import KakaoCallback from "./pages/SignUp/KakaoCallback.jsx";
import LetterRoom from "./pages/LetterRoom/LetterRoom.jsx";
import LetterRoomCreate from "./pages/LetterRoomCreate/LetterRoomCreate.jsx";
import LetterRoomOpen from "./pages/LetterRoom/LetterRoomOpen.jsx";
import LetterRoomLocked from "./pages/LetterRoom/LetterRoomLocked";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/letterroom" element={<LetterRoom />} />
      <Route path="/letterroom/create" element={<LetterRoomCreate />} />
      <Route path="/letterroom/open/:id" element={<LetterRoomOpen />} />
      <Route path="/letterroom/locked/:id" element={<LetterRoomLocked />} />
    </Routes>
  );
}