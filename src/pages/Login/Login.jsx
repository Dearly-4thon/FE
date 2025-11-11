import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import eye from "../../assets/eye.svg";
import eyeoff from "../../assets/eyeoff.svg";
import Toast from "../../components/Toast/Toast.jsx";
import { BASE_URL } from "../../api/config.js";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  /** 일반 로그인 */
  const handleLogin = async () => {
    if (!username || !password) {
      showToast("아이디와 비밀번호를 입력해주세요.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("로그인 성공! 💌", "success");

        // 토큰 저장 (백엔드에서 access/refresh 둘 다 주면 둘 다 저장)
        if (data.access) {
          localStorage.setItem("accessToken", data.access);
        }
        if (data.refresh) {
          localStorage.setItem("refreshToken", data.refresh);
        }

        // 페이지 이동
        setTimeout(() => navigate("/letterroom"), 1000);
      } else {
        showToast(data.message || "로그인 실패 😢", "error");
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
      showToast("서버 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** 카카오 로그인 (선택사항: 콜백 연결 시 수정 가능) */
  const handleKakaoLogin = () => {
    window.location.href = "https://zihyuniz.shop/accounts/kakao/login/";
  };


  return (
    <div className="login-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 로고 영역 */}
      <div className="logo-section">
        <span className="logo-icon">💌</span>
        <h1 className="logo-text">Dearly</h1>
        <span className="logo-icon">✉️</span>
      </div>

      <p className="subtitle">소중한 사람들과 함께하는 추억의 공간</p>

      {/* 로그인 폼 */}
      <div className="login-form-box">
        <div className="input-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? eyeoff : eye}
              alt="toggle password visibility"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="social-login-divider">
          <span>간편 로그인</span>
        </div>

        <button
          className="kakao-login-button"
          onClick={handleKakaoLogin}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 38 38" fill="none">
            <path
              d="M19 0C8.505 0 0 6.74 0 15.06C0 20.88 4.84 25.83 11.79 27.96L10.24 34.48C10.09 35.14 10.86 35.63 11.4 35.23L19.24 29.51C19.82 29.54 20.41 29.56 21 29.56C31.49 29.56 40 22.83 40 14.51C40 6.19 31.49 0 21 0H19Z"
              fill="#191919"
            />
          </svg>
          카카오 로그인
        </button>
      </div>

      <p className="out-link">
        아직 계정이 없으신가요?{" "}
        <span onClick={() => navigate("/signup")}>회원가입</span>
      </p>

      <p className="login-footer">© 2025 Dearly. All rights reserved.</p>
    </div>
  );
}
