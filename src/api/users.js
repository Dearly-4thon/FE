// src/api/users.js
import { api } from "./api";

/**
 * 내 프로필 조회 (GET /users/me/)
 * 응답 예시(서버 기준):
 * {
 *   id, user_id, nickname, profile_image,
 *   created_letterroom_count, sent_letter_count, received_letter_count, ...
 * }
 */
export async function getMyProfile() {
  const { data } = await api.get("/users/me/");
  return data;
}

/**
 * 내 프로필 수정 (PATCH /users/me/)
 * - 닉네임/프로필이미지 URL만 JSON으로 보냄
 * - 파일 업로드가 필요하면 아래 uploadAvatar 사용
 *
 * @param {{ nickname?: string, profile_image?: string }} payload
 */
export async function updateMyProfile(payload = {}) {
  // 서버가 허용하는 필드만 필터
  const allowed = ["nickname", "profile_image"];
  const body = {};
  for (const k of allowed) {
    if (payload[k] !== undefined && payload[k] !== null) body[k] = payload[k];
  }
  const { data } = await api.patch("/users/me/", body, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

/**
 * 프로필 이미지 파일 업로드가 필요할 경우 (서버가 PATCH /users/me/ multipart 지원 시)
 * @param {File} file
 */
export async function uploadAvatar(file) {
  const fd = new FormData();
  // 백 문서에서 필드명이 profile_image 로 보였음 (필요 시 avatar 등으로 교체)
  fd.append("profile_image", file);

  const { data } = await api.patch("/users/me/", fd); // FormData는 헤더 자동
  return data;
}

/**
 * 특정 유저 프로필 조회 (GET /users/{id}/)
 */
export async function getUserProfileById(userId) {
  if (!userId && userId !== 0) throw new Error("userId is required");
  const { data } = await api.get(`/users/${userId}/`);
  return data;
}
