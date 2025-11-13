// src/api/LetterRoom.js
import { get, post, del } from "./api";

/* 내 편지방 목록 */
export const getMyLetterRooms = async () => {
  const owner = localStorage.getItem("user_id");
  const res = await get(`/letterrooms/my?owner=${owner}`);
  return res.data;
};

/* 편지방 생성 */
export const createLetterRoom = async (formData) => {
  const res = await post("/letterrooms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* 편지방 삭제 */
export const deleteLetterRoom = async (roomId) => {
  await del(`/letterrooms/${roomId}`);
  return true;
};

/* 편지 목록 조회 */
export const getLettersInRoom = async (roomId) => {
  const res = await get(`/letterrooms/${roomId}/letters`);
  return res.data;
};

/* 공유 링크 조회 */
export const getShareLink = async (roomId) => {
  const res = await get(`/letterrooms/${roomId}/share-link`);
  return res.data;
};

/* 공유 코드로 조회 */
export const getRoomByShareCode = async (shareCode) => {
  const res = await get(`/letterrooms/public/${shareCode}`);
  return res.data;
};
