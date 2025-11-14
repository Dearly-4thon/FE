import { BASE_URL } from "./config";

export const saveTokens = (access, refresh) => {
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("nickname");
};


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


export const registerUser = async ({ username, nickname, password, passwordCheck }) => {
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


export const checkUserId = async (username) => {
  const res = await fetch(
    `${BASE_URL}/auth/check-user-id/?user_id=${username}`
  );

  const data = await res.json();
  return { ok: res.ok, data };
};


export const getKakaoLoginUrl = () => {
  return `${BASE_URL}/accounts/kakao/login/`;
};


export const handleKakaoCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  const access = params.get("access");
  const refresh = params.get("refresh");

  if (access) {
    saveTokens(access, refresh);
    return { success: true };
  }

  return { success: false };
};