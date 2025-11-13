import { BASE_URL } from "./config.js";

/* -----------------------------
    토큰 키 통일
----------------------------- */
const ACCESS = "access_token";
const REFRESH = "refresh_token";
const USERID = "user_id";

/* -----------------------------
    로컬 저장/조회
----------------------------- */
export const saveTokens = (access, refresh) => {
  if (access) localStorage.setItem(ACCESS, access);
  if (refresh) localStorage.setItem(REFRESH, refresh);
};

export const getAccessToken = () => localStorage.getItem(ACCESS);
export const getRefreshToken = () => localStorage.getItem(REFRESH);
export const getUserId = () => localStorage.getItem(USERID);

export const logout = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USERID);
};

/* -----------------------------
    일반 로그인
----------------------------- */
export const loginUser = async ({ username, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: username,
      password,
    }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

/* -----------------------------
    회원가입
----------------------------- */
export const registerUser = async ({
  username,
  nickname,
  password,
  passwordCheck,
}) => {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: username,
      nickname,
      password,
      password_confirm: passwordCheck,
    }),
  });

  const data = await res.json();
  return { ok: res.status === 201, data };
};

/* -----------------------------
    아이디 중복 확인
----------------------------- */
export const checkUserId = async (username) => {
  const res = await fetch(
    `${BASE_URL}/auth/check-user-id/?user_id=${username}`
  );
  const data = await res.json();
  return { ok: res.ok, data };
};

/* -----------------------------
    카카오 로그인 URL
----------------------------- */
export const getKakaoLoginUrl = () => {
  return `${BASE_URL}/accounts/kakao/login/`;
};

/* -----------------------------
    카카오 콜백 처리
----------------------------- */
export const handleKakaoCallback = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");
    const userId = params.get("user_id");

    if (!access || !refresh || !userId) {
      console.error("카카오 토큰 누락:", { access, refresh, userId });
      return { success: false };
    }

    //통일된 키로 저장
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
    localStorage.setItem(USERID, userId);

    return { success: true };
  } catch (e) {
    console.error("카카오 콜백 처리 오류:", e);
    return { success: false };
  }
};

/* -----------------------------
    Authorization Header
----------------------------- */
const authHeader = () => {
  const at = getAccessToken();
  return at ? { Authorization: `Bearer ${at}` } : {};
};

/* -----------------------------
    서버 로그아웃
----------------------------- */
export const logoutServer = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (res.ok) {
    logout();
  }
  return { ok: res.ok, data };
};

/* -----------------------------
    비밀번호 변경
----------------------------- */
export const changePassword = async ({
  currentPassword,
  newPassword,
  newPasswordConfirm,
  ...rest
}) => {
  const body = {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
    ...rest,
  };

  const res = await fetch(`${BASE_URL}/auth/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { ok: res.ok, data };
};
