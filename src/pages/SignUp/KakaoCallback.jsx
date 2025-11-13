import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleKakaoCallback } from "../../api/auth.js";
import Toast from "../../components/Toast/Toast.jsx";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [toast, setToast] = React.useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ message: msg, type });
  };

  useEffect(() => {
    const process = async () => {
      if (!code) {
        showToast("카카오 인증 코드가 없습니다.", "error");
        setTimeout(() => navigate("/login"), 800);
        return;
      }

      try {
        const data = await handleKakaoCallback(code);

        // 토큰 저장
        if (data.access) localStorage.setItem("accessToken", data.access);
        if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
        if (data.user) {
          localStorage.setItem("user_id", data.user.id);
          localStorage.setItem("nickname", data.user.nickname);
        }

        showToast("로그인 성공!", "success");
        setTimeout(() => navigate("/letters"), 300);
      } catch (err) {
        console.error("카카오 콜백 오류:", err);
        const msg = err.response?.data?.message || "카카오 로그인 실패";
        showToast(msg, "error");
        setTimeout(() => navigate("/login"), 800);
      }
    };

    process();
  }, [code, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <p>카카오 로그인 처리 중입니다...</p>
    </div>
  );
}
