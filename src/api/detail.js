import { api } from "./api";

// 편지 상세 조회 및 관리 API
export function getLetterDetail(id) {
  return api.get(`/letters/${id}/`);
}

// 편지 PDF 다운로드
export function downloadLetterPDF(id) {
  return api.get(`/api/letters/${id}/pdf`, {
    responseType: 'blob'
  });
}

// 편지 읽음 처리
export function markAsRead(letterId) {
  return api.patch(`/letters/${letterId}/read/`);
}

// 편지 삭제
export function deleteLetter(id) {
  return api.delete(`/letters/${id}/`);
}