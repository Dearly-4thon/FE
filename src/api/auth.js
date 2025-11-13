import { BASE_URL } from "./config.js";

// 토큰 관리 유틸
export const saveTokens = (access, refresh) => {
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};


// 일반 로그인
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


// 회원가입
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


// 아이디 중복 확인
export const checkUserId = async (username) => {
  const res = await fetch(
    `${BASE_URL}/auth/check-user-id/?user_id=${username}`
  );

  const data = await res.json();
  return { ok: res.ok, data };
};


// 카카오 로그인 URL
export const getKakaoLoginUrl = () => {
  return `${BASE_URL}/accounts/kakao/login/`;
};


// 카카오 로그인 콜백 처리
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

// Authorization 헤더 생성(로컬 토큰 사용)
const authHeader = () => {
  const at = getAccessToken();
  return at ? { Authorization: `Bearer ${at}` } : {};
};

/** 서버 로그아웃
 * POST /auth/logout
 * 성공하면 로컬 토큰도 지움
 */
export const logoutServer = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  });

  let data = null;
  try { data = await res.json(); } catch (_) {}

  if (res.ok) {
    // 서버에서 세션/토큰 정리가 완료됐으니 로컬도 정리
    logout();
  }
  return { ok: res.ok, data };
};

/** 비밀번호 재설정(변경)
 * POST /auth/change-password
 * 기본 필드: current_password, new_password, new_password_confirm
 * 백엔드가 다른 키를 쓰면 payload에 추가로 넘긴 값(rest)이 그대로 병합됨.
 *
 * 예)
 * changePassword({
 *   currentPassword: 'old1234',
 *   newPassword: 'new1234!',
 *   newPasswordConfirm: 'new1234!'
 * })
 */
export const changePassword = async ({
  currentPassword,
  newPassword,
  newPasswordConfirm,
  ...rest // 서버가 password/password_confirm 등을 요구하는 경우 대응
}) => {
  const body = {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
    ...rest,
  };

  const res = await fetch(`${BASE_URL}/auth/change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { ok: res.ok, data };
};
// ==== 추가 끝 ====

