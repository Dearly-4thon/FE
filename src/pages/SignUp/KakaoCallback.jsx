import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access) {
      localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      navigate("/letterroom"); // 로그인 후 페이지로 이동
    } else {
      console.error("카카오 토큰이 전달되지 않았습니다.");
      navigate("/login");
    }
  }, [navigate]);

  return <p>카카오 로그인 중입니다... 🔄</p>;
}
