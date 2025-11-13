// src/api/api.js
import axios from "axios";
import { API_BASE } from "./config";

// ---- 토큰 유틸 (raw 저장 권장, Bearer가 들어와도 보정) ----
const stripBearer = (v = "") => v.replace(/^Bearer\s+/i, "");
const bearify    = (raw = "") => (raw ? `Bearer ${stripBearer(raw)}` : "");
const getAccess  = () => stripBearer(localStorage.getItem("accessToken") || "");
const getRefresh = () => stripBearer(localStorage.getItem("refreshToken") || "");
const setAccess  = (raw = "") => localStorage.setItem("accessToken", stripBearer(raw));
const setRefresh = (raw = "") => localStorage.setItem("refreshToken", stripBearer(raw));

// ---- 공통 인스턴스 ----
export const api = axios.create({
  baseURL: API_BASE,         // 예: https://zihyuniz.shop
  timeout: 10000,
  // withCredentials: true,   // (쿠키 인증이면 on, 지금은 헤더 JWT라 불필요)
});

// ---- 요청 인터셉터: access 자동 부착 ----
api.interceptors.request.use((config) => {
  // 로그인/리프레시는 패스
  const url = String(config.url || "");
  if (/\/auth\/(login|refresh)\/?$/i.test(url)) return config;

  const access = getAccess();
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = bearify(access); // 항상 "Bearer xxx"로 보냄
  }
  return config;
});

// ---- 응답 인터셉터: 401이면 refresh로 1회 재시도 ----
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err;
    if (!response) throw err;                    // 네트워크 오류 등
    if (response.status !== 401 || config._retry) throw err;

    // 동시 401 요청 합치기
    if (!refreshing) {
      const rt = getRefresh();
      if (!rt) {
        // 리프레시도 없으면 로그인 필요
        throw err;
      }
      refreshing = axios
        .post(`${API_BASE}/auth/refresh/`, { refresh: rt })
        .then(({ data }) => {
          // 서버가 둘 중 아무 형식으로 줄 수 있으니 모두 대응
          const newAccess  = data.tokens?.access  ?? data.access;
          const newRefresh = data.tokens?.refresh ?? data.refresh;
          if (newAccess)  setAccess(newAccess);
          if (newRefresh) setRefresh(newRefresh);
        })
        .finally(() => { refreshing = null; });
    }

    await refreshing;

    // 새 access로 원요청 1회 재시도
    config._retry = true;
    config.headers = config.headers || {};
    const access = getAccess();
    if (access) config.headers.Authorization = bearify(access);
    return api(config);
  }
);

// ---- 편의 메소드 (선택) ----
export const get   = (url, cfg)       => api.get(url, cfg);
export const post  = (url, body, cfg) => api.post(url, body, cfg);
export const patch = (url, body, cfg) => api.patch(url, body, cfg);
export const del   = (url, cfg)       => api.delete(url, cfg);
