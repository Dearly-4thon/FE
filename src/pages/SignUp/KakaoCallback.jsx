import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleKakaoCallback } from "../../api/auth.js";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const process = async () => {
      const result = await handleKakaoCallback();

      setTimeout(() => {
        if (result.success) {
          navigate("/letterroom");
        } else {
          navigate("/login");
        }
      }, 50);
    };

    process();
  }, [navigate]);

  return <p>카카오 로그인 중입니다... </p>;
}
