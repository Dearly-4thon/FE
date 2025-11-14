
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import eye from "../../assets/icons/eye.svg";
import eyeoff from "../../assets/icons/eyeoff.svg";
import Toast from "../../components/Toast/Toast.jsx";
import { registerUser, checkUserId } from "../../api/auth.js";


export default function Signup() {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const showToast = (message, type = "info") => setToast({ message, type });

  /* 아이디 중복 확인 */
  const handleCheckUsername = async () => {
    if (!username) {
      showToast("아이디를 입력해주세요.", "error");
      return;
    }

    try {
      const res = await checkUserId(username);

      if (res.ok) {
        if (res.data.available) {
          showToast("사용 가능한 아이디입니다.", "success");
        } else {
          showToast("이미 사용 중인 아이디입니다.", "error");
        }
      } else {
        showToast(res.data.message || "요청이 올바르지 않습니다.", "error");
      }
    } catch (err) {
      console.error("아이디 중복 확인 오류:", err);
      showToast("서버 오류가 발생했습니다.", "error");
    }
  };


  /* 회원가입 */
  const handleSignup = async () => {
    if (!username || !password || !passwordCheck) {
      showToast("모든 필드를 입력해주세요.", "error");
      return;
    }
    if (password.length < 8) {
      showToast("비밀번호는 8자 이상이어야 합니다.", "error");
      return;
    }
    if (password !== passwordCheck) {
      showToast("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        username,
        nickname,
        password,
        passwordCheck,
      });

      if (res.ok) {
        showToast("회원가입 성공!", "success");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        showToast(res.data.message || "회원가입 실패", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("서버 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signup-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 로고 */}
      <div className="logo-section">
        <span className="logo-icon">💌</span>
        <h1 className="logo-text">Dearly</h1>
        <span className="logo-icon">✉️</span>
      </div>

      {/* 회원가입 폼 */}
      <div className="signup-form-box">
        <h2 className="form-title">회원가입</h2>

        {/* 아이디 */}
        <div className="input-group">
          <label htmlFor="username">아이디</label>
          <div className="id-check-wrapper">
            <input
              type="text"
              id="username"
              placeholder="4-14자 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button className="check-button" onClick={handleCheckUsername}>
              중복확인
            </button>
          </div>
        </div>

        {/* 이름 */}
        <div className="input-group">
          <label htmlFor="nickname">이름</label>
          <input
            type="text"
            id="nickname"
            placeholder="이름을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* 비밀번호 */}
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="영어+숫자 8-16자"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? eyeoff : eye}
              alt="toggle password"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <div className="password-wrapper">
            <input
              type={showPasswordCheck ? "text" : "password"}
              id="passwordCheck"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <img
              src={showPasswordCheck ? eyeoff : eye}
              alt="toggle password"
              className="eye-icon"
              onClick={() => setShowPasswordCheck(!showPasswordCheck)}
            />
          </div>
        </div>

        <button
          className="signup-button"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </div>

      <p className="login-link">
        이미 계정이 있으신가요?{" "}
        <span onClick={() => navigate("/login")}>로그인</span>
      </p>
    </div>
  );
}
