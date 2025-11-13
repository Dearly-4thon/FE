import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import eye from "../../assets/eye.svg";
import eyeoff from "../../assets/eyeoff.svg";
import Toast from "../../components/Toast/Toast.jsx";
import DearlyLogo from "../../components/DearlyLogo.jsx"; 
import { loginUser, saveTokens, getKakaoLoginUrl } from "../../api/auth.js";


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

  /* 일반 로그인 */
  const handleLogin = async () => {
    if (!username || !password) {
      showToast("아이디와 비밀번호를 입력해주세요.", "error");
      return;
    }

    setLoading(true);
    const res = await loginUser({ username, password });

    if (res.ok) {
      saveTokens(res.data.access, res.data.refresh);
      showToast("로그인 성공!", "success");
      setTimeout(() => navigate("/letterroom"), 1000);
    } else {
      showToast(res.data.message || "로그인 실패", "error");
    }

    setLoading(false);
  };

  /* 카카오 로그인 */
  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
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
      <div className="login-logo">
        <DearlyLogo />
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