import { API_BASE } from "./config";
import { api, setAccess, setRefresh } from "./api";

/* -----------------------------
  사용자 정보 키
----------------------------- */
const USER_ID = "user_id";
const NICKNAME = "nickname";

/* -----------------------------
  저장 유틸
----------------------------- */
export const saveUserInfo = (userId, nickname) => {
  if (userId) localStorage.setItem(USER_ID, userId);
  if (nickname) localStorage.setItem(NICKNAME, nickname);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getUserId = () => localStorage.getItem(USER_ID);

/* -----------------------------
  일반 로그인
----------------------------- */
export const loginUser = async ({ username, password }) => {
  const res = await api.post(`/auth/login/`, {
    username,
    password,
  });

  const data = res.data;

  setAccess(data.access);
  setRefresh(data.refresh);

  saveUserInfo(data.user_id, data.nickname);

  return { ok: true, data };
};

/* -----------------------------
  회원가입
----------------------------- */
export const registerUser = async ({ username, nickname, password, passwordCheck }) => {
  try {
    const res = await api.post(`/auth/signup/`, {
      username,
      nickname,
      password,
      password_confirm: passwordCheck,
    });

    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: err.response?.data || {} };
  }
};

/* -----------------------------
  아이디 중복 확인
----------------------------- */
export const checkUserId = async (username) => {
  const res = await api.get(`/auth/check-username?username=${username}`);
  return { ok: true, data: res.data };
};

/* -----------------------------
  카카오 로그인 URL
----------------------------- */
export const getKakaoLoginUrl = () => `${API_BASE}/auth/login/kakao`;

/* -----------------------------
  카카오 콜백 처리
----------------------------- */
export const handleKakaoCallback = async () => {
  const params = new URLSearchParams(window.location.search);

  const access = params.get("access");
  const refresh = params.get("refresh");
  const userId = params.get("user_id");
  const nickname = params.get("nickname");

  if (!access || !refresh) return { success: false };

  setAccess(access);
  setRefresh(refresh);
  saveUserInfo(userId, nickname);

  return { success: true };
};

/* -----------------------------
  로그아웃
----------------------------- */
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(NICKNAME);
};
