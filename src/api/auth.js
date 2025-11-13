// src/api/auth.js
import { get, post } from "./api";
import { API_BASE } from "./config";

// 로컬 key 이름 통일
const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const USERID = "user_id";
const NICKNAME = "nickname";

/* 저장 / 조회 */
export const saveTokens = (access, refresh) => {
  if (access) localStorage.setItem(ACCESS, access);
  if (refresh) localStorage.setItem(REFRESH, refresh);
};
export const getAccessToken = () => localStorage.getItem(ACCESS);
export const getRefreshToken = () => localStorage.getItem(REFRESH);
export const getUserId       = () => localStorage.getItem(USERID);
export const getNickname     = () => localStorage.getItem(NICKNAME);

export const logoutLocal = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USERID);
  localStorage.removeItem(NICKNAME);
};

/* -----------------------
   로그인
----------------------- */
export const loginUser = async ({ username, password }) => {
  const res = await post("/auth/login", {
    username,       // 명세서 기준 username
    password,
  });

  const data = res.data;

  // 토큰 저장
  saveTokens(data.access, data.refresh);

  // 사용자 정보 저장 (닉네임/ID 등)
  if (data.user?.id) localStorage.setItem(USERID, data.user.id);
  if (data.user?.nickname) localStorage.setItem(NICKNAME, data.user.nickname);

  return data;
};

/* -----------------------
   회원가입
----------------------- */
export const registerUser = async ({ username, nickname, password, passwordCheck }) => {
  const res = await post("/auth/signup", {
    username,
    nickname,
    password,
    password_confirm: passwordCheck,
  });

  return res.data;
};

/* -----------------------
   아이디 중복 확인
----------------------- */
export const checkUserId = async (username) => {
  const res = await get(`/auth/check-username?username=${username}`);
  return res.data;
};

/* -----------------------
   카카오 로그인 URL
----------------------- */
export const getKakaoLoginUrl = () =>
  `${API_BASE}/auth/login/kakao`;

/* -----------------------
   카카오 콜백 결과 저장
----------------------- */
export const handleKakaoCallback = async () => {
  const params = new URLSearchParams(window.location.search);

  const access  = params.get("access");
  const refresh = params.get("refresh");
  const uid     = params.get("user_id");
  const nick    = params.get("nickname");

  if (!access || !refresh) return false;

  saveTokens(access, refresh);

  if (uid)  localStorage.setItem(USERID, uid);
  if (nick) localStorage.setItem(NICKNAME, nick);

  return true;
};

/* -----------------------
   로그아웃
----------------------- */
export const logoutServer = async () => {
  try {
    await post("/auth/logout");
  } catch (_) {}
  logoutLocal();
};
