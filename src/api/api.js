import axios from "axios";
import { API_BASE } from "./config";

console.log("💡 API_BASE = ", API_BASE);

// ---- 토큰 키 ----
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// ---- 토큰 유틸 ----
const stripBearer = (v = "") => v.replace(/^Bearer\s+/i, "");
const bearify = (raw = "") => (raw ? `Bearer ${stripBearer(raw)}` : "");

export const getAccess = () => stripBearer(localStorage.getItem(ACCESS_KEY) || "");
export const getRefresh = () => stripBearer(localStorage.getItem(REFRESH_KEY) || "");

export const setAccess = (raw = "") =>
  localStorage.setItem(ACCESS_KEY, stripBearer(raw));

export const setRefresh = (raw = "") =>
  localStorage.setItem(REFRESH_KEY, stripBearer(raw));

// ---- axios 인스턴스 ----
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ---- 요청 인터셉터: Access 자동 부착 ----
api.interceptors.request.use((config) => {
  const url = String(config.url || "");

  // 로그인/리프레시 요청은 토큰 제외
  if (/\/auth\/(login|refresh)\/?$/i.test(url)) return config;

  const access = getAccess();
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = bearify(access);
  }
  return config;
});

// ---- 응답 인터셉터: 401 → refresh 재발급 후 재요청 ----
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err;

    if (!response) throw err;
    if (response.status !== 401 || config._retry) throw err;

    if (!refreshing) {
      const refreshToken = getRefresh();
      if (!refreshToken) throw err;

      refreshing = axios
        .post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken })
        .then(({ data }) => {
          const newAccess = data.access || data.tokens?.access;
          const newRefresh = data.refresh || data.tokens?.refresh;

          if (newAccess) setAccess(newAccess);
          if (newRefresh) setRefresh(newRefresh);
        })
        .finally(() => (refreshing = null));
    }

    await refreshing;

    config._retry = true;
    config.headers = config.headers || {};
    config.headers.Authorization = bearify(getAccess());

    return api(config);
  }
);

// ---- 편의 메소드 ----
export const get = (url, cfg) => api.get(url, cfg);
export const post = (url, body, cfg) => api.post(url, body, cfg);
export const patch = (url, body, cfg) => api.patch(url, body, cfg);
export const del = (url, cfg) => api.delete(url, cfg);
