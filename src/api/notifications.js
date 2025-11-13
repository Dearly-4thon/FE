// src/api/notifications.js
import { get, post } from "./api";

export const getNotifications = (params = {}) => {
  const q = new URLSearchParams();
  if (params.unread_only === true) q.set("unread_only", "true");
  if (params.page) q.set("page", params.page);
  if (params.page_size) q.set("page_size", params.page_size);
  const qs = q.toString();
  return get(`/notifications${qs ? `?${qs}` : ""}`);
};

export const getUnreadNotifications = () =>
  get("/notifications?unread_only=true");

// 이름을 markAsRead로 export (별칭도 같이 내보내면 더 편함)
export const markAsRead = (id) =>
  post(`/notifications/${encodeURIComponent(id)}/read`, {});

// 선택: 기존 이름도 유지하고 싶다면 아래 한 줄 추가
export const readNotification = markAsRead;

// 서버 500일때 빈 목록 뜨게
export const safeGetNotifications = async (params = {}) => {
  try {
    return await getNotifications(params);
  } catch (e) {
    if (e?.response?.status === 500) return []; // 빈 목록로 폴백
    throw e;
  }
};
