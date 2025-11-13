import { BASE_URL } from "./config.js";

const getToken = () => localStorage.getItem("access_token");
const getOwnerId = () => localStorage.getItem("user_id");

// 내 편지방 목록 조회
export const getMyLetterRooms = async () => {
  const token = getToken();
  const owner = getOwnerId();

  const response = await fetch(`${BASE_URL}/letterrooms/my?owner=${owner}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("편지방 목록 조회 실패");
  return response.json();
};


//  편지방 생성 (FormData)
export const createLetterRoom = async (formData) => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/letterrooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
};

// 3) 편지방 삭제
export const deleteLetterRoom = async (roomId) => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/letterrooms/${roomId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("편지방 삭제 실패");
  return true;
};

// 4) 편지 목록 조회
export const getLettersInRoom = async (roomId) => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/letterrooms/${roomId}/letters`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("편지 목록 조회 실패");
  return response.json();
};

// 5) 공유 링크 조회
export const getShareLink = async (roomId) => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/letterrooms/${roomId}/share-link`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("공유 링크 조회 실패");
  return response.json();
};

// 6) 공유코드로 편지방 정보 조회
export const getRoomByShareCode = async (shareCode) => {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/letterrooms/public/${shareCode}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("공유코드 편지방 조회 실패");
  return response.json();
};
