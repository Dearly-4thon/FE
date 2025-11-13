// src/api/notices.js
import { get, post } from "./api";

/** 공지 목록 조회
 * @param {Object} params - 예: { page: 1, page_size: 10, ordering: "-created_at" }
 * 백엔드가 페이지네이션/정렬 파라미터를 지원하면 그대로 붙여서 보냄.
 */
export const getNotices = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/notices${qs ? `?${qs}` : ""}`);
};

/** 공지 단건 조회 */
export const getNotice = (noticeId) =>
  get(`/notices/${encodeURIComponent(noticeId)}`);

/** 새 공지 등록 (관리자/운영자 전용일 수 있음)
 * @param {Object} payload - 예: { title: "제목", content: "본문" }
 * 스키마는 백엔드 스펙 그대로 전달.
 */
export const createNotice = (payload) => post("/notices", payload);

/** 새 공지 여부 체크 (스웨거에 표시된 경우)
 * 서버가 { has_new: boolean, last_notice_id?: number } 형태를 줄 것으로 가정
 */
export const hasNewNotice = () => get("/notices/has-new");

