import { api } from "./api";

// 조회 관련 API (검색, 필터링, 페이지네이션 등)

// 편지 검색
export function searchLetters(keyword, filters = {}) {
  const params = new URLSearchParams();
  
  if (keyword) params.append('search', keyword);
  if (filters.dateFrom) params.append('date_from', filters.dateFrom);
  if (filters.dateTo) params.append('date_to', filters.dateTo);
  if (filters.sender) params.append('sender', filters.sender);
  if (filters.isOpen !== undefined) params.append('is_open', filters.isOpen);
  
  return api.get(`/letters/search/?${params.toString()}`);
}

// 편지 개수 조회
export function getLetterCounts() {
  return api.get('/letters/counts/');
}

// 읽지 않은 편지 개수
export function getUnreadCount() {
  return api.get('/letters/unread-count/');
}

// 편지 상태 업데이트 (읽음 처리)
export function markAsRead(letterId) {
  return api.patch(`/letters/${letterId}/read/`);
}

// 편지 필터링 (날짜, 상태별)
export function getFilteredLetters(filterOptions = {}) {
  const params = new URLSearchParams();
  
  if (filterOptions.status) params.append('status', filterOptions.status);
  if (filterOptions.dateRange) params.append('date_range', filterOptions.dateRange);
  if (filterOptions.letterType) params.append('type', filterOptions.letterType);
  
  return api.get(`/letters/filtered/?${params.toString()}`);
}

// 페이지네이션된 편지 목록
export function getLettersWithPagination(page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams();
  
  params.append('page', page);
  params.append('limit', limit);
  
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  
  return api.get(`/letters/paginated/?${params.toString()}`);
}