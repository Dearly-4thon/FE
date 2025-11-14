// src/api/users.js
import { BASE_URL } from "./config";
import { getAccessToken } from "./auth";

// 공통으로 Authorization 헤더 만들어주는 함수
const getAuthHeaders = () => {
  const access = getAccessToken();
  return access
    ? { Authorization: `Bearer ${access}` }
    : {};
};

// 1) 내 프로필 조회: GET /users/me/
export const fetchMyProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

// 2) 내 프로필 수정: PATCH /users/me/
// profileData 안에 { nickname, introduction, ... } 이런 식으로 필요한 값 넣기
export const updateMyProfile = async (profileData) => {
  const res = await fetch(`${BASE_URL}/users/me/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(profileData),
  });

  const data = await res.json().catch(() => ({})); // 204 대비용
  return { ok: res.ok, data };
};

// 3) 특정 유저 프로필 조회: GET /users/{id}/
export const fetchUserProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();
  return { ok: res.ok, data };
};
