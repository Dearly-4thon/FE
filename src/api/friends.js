// src/api/friends.js
import { API_BASE } from "./config";
import { getAccessToken } from "./auth";

// 공통 헤더
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAccessToken()}`,
});

// =============================
// 1. GET /friends/  친구 목록 조회
// =============================
export const getFriends = async () => {
  const res = await fetch(`${API_BASE}/friends/`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  return { ok: res.ok, data };
};

// =============================
// 2. DELETE /friends/{friends_id} 친구 삭제
// =============================
export const deleteFriend = async (friendshipId) => {
  const res = await fetch(`${API_BASE}/friends/${friendshipId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return { ok: res.ok };
};

// ======================================
// 3. POST /friends/{friend_id}/favorite 즐겨찾기 토글
// ======================================
export const toggleFriendFavorite = async (friendId) => {
  const res = await fetch(`${API_BASE}/friends/${friendId}/favorite`, {
    method: "POST",
    headers: authHeaders(),
  });
  return { ok: res.ok };
};

// ======================================
// 4. GET /friends/{friend_id}/profile 친구 프로필 조회
// ======================================
export const getFriendProfile = async (friendId) => {
  const res = await fetch(`${API_BASE}/friends/${friendId}/profile`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  return { ok: res.ok, data };
};

// ======================================
// 5. POST /friends/requests 친구 요청 보내기
// ======================================
export const sendFriendRequest = async ({ receiver_id }) => {
  const res = await fetch(`${API_BASE}/friends/requests`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ receiver_id }),
  });
  return { ok: res.ok };
};

// ======================================
// 6. POST /friends/requests/{id}/accept 친구 요청 수락
// ======================================
export const acceptFriendRequest = async (requestId) => {
  const res = await fetch(`${API_BASE}/friends/requests/${requestId}/accept`, {
    method: "POST",
    headers: authHeaders(),
  });
  return { ok: res.ok };
};

// ======================================
// 7. POST /friends/requests/{id}/reject 친구 요청 거절
// ======================================
export const rejectFriendRequest = async (requestId) => {
  const res = await fetch(`${API_BASE}/friends/requests/${requestId}/reject`, {
    method: "POST",
    headers: authHeaders(),
  });
  return { ok: res.ok };
};

// ======================================
// 8. GET /friends/requests/received 받은 친구 요청
// ======================================
export const getReceivedFriendRequests = async () => {
  const res = await fetch(`${API_BASE}/friends/requests/received`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  return { ok: res.ok, data };
};

// ======================================
// 9. GET /friends/search?q=아이디또는닉네임  유저 검색
// ======================================
export const searchFriends = async (keyword) => {
  const q = (keyword || "").trim();

  if (!q) {
    return { ok: true, data: [] };
  }

  const res = await fetch(
    `${API_BASE}/friends/search?q=${encodeURIComponent(q)}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }

  // 서버 응답이 배열인 경우
  if (Array.isArray(json)) {
    return { ok: res.ok, data: json };
  }

  // 객체로 오는 경우 (예: { results: [...] } 형태)
  if (json && typeof json === "object") {
    if (Array.isArray(json.results)) return { ok: res.ok, data: json.results };
    if (Array.isArray(json.data)) return { ok: res.ok, data: json.data };
    if (Array.isArray(json.users)) return { ok: res.ok, data: json.users };
    if (Array.isArray(json.friends)) return { ok: res.ok, data: json.friends };
  }

  // 기타 예상 못한 구조 → 단일 객체면 배열로 감싸주기
  return { ok: res.ok, data: json ? [json] : [] };
};