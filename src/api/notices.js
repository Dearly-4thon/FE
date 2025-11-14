// src/api/notices.js
import { API_BASE } from "./config";
import { getAccessToken } from "./auth";

// GET /notices/  공지사항 목록 조회
export const getNotices = async () => {
  try {
    const res = await fetch(`${API_BASE}/notices/`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    let data = null;

    // 응답 본문이 비어 있거나 JSON이 아니면 json()에서 에러 나니까 방어 코드
    try {
      data = await res.json();
    } catch (e) {
      console.warn("⚠️ /notices/ json 파싱 실패, 빈 배열로 처리:", e);
      data = [];
    }

    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("❌ /notices/ 요청 자체가 실패:", error);
    // 여기서는 절대 throw 하지 말고, 항상 객체를 리턴
    return { ok: false, data: null, status: null, error };
  }
};