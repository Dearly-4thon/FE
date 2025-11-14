// src/api/notifications.js
import { API_BASE } from "./config";
import { getAccessToken } from "./auth";

// 공통 헤더
const getAuthHeaders = () => {
  const token = getAccessToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * GET /notifications/
 * 전체 알림 목록 조회
 */
export const getNotifications = async () => {
  try {
    const res = await fetch(`${API_BASE}/notifications/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  } catch (error) {
    console.error("알림 목록 조회 중 에러:", error);
    return { ok: false, data: null };
  }
};

/**
 * POST /notifications/{id}/read/
 * 특정 알림 읽음 처리
 */
export const markNotificationRead = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/notifications/${id}/read/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}), // 보낼 데이터 없으면 빈 객체
    });

    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  } catch (error) {
    console.error("알림 읽음 처리 중 에러:", error);
    return { ok: false, data: null };
  }
};