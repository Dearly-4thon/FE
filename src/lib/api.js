// src/lib/api.js

// API 서버 베이스 URL: .env에 VITE_API_BASE=https://api.example.com 처럼 넣어두면 사용돼요.
// 없으면 현재 origin을 사용합니다.
const API_BASE = import.meta.env.VITE_API_BASE || "";

// 토큰 저장 위치에 맞게 수정 (예: sessionStorage)
export function getAccessToken() {
  return localStorage.getItem("access_token") || "";
}

// JSON fetch 헬퍼
export async function fetchJSON(path, { signal, params } = {}) {
  const base = API_BASE || window.location.origin;
  const url = new URL(path, base);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") url.searchParams.set(k, v);
    });
  }

  const headers = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    signal,
    credentials: "include", // 쿠키 세션 사용하는 경우
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return res.json();
}
