// 정렬 옵션 관련 유틸리티 함수들

// 정렬 방식 enum
export const SORT_OPTIONS = {
  LATEST: "latest",
  OLDEST: "oldest",
  ALPHABETICAL: "alphabetical"
};

// 정렬 파라미터 생성
export function createSortParam(sortType) {
  switch(sortType) {
    case SORT_OPTIONS.LATEST:
      return "latest";
    case SORT_OPTIONS.OLDEST:
      return "oldest";
    case SORT_OPTIONS.ALPHABETICAL:
      return "alphabetical";
    default:
      return "latest";
  }
}

// 정렬된 URL 엔드포인트 생성
export function createSortedEndpoint(baseEndpoint, sortType) {
  const sortParam = createSortParam(sortType);
  
  if (sortType === SORT_OPTIONS.LATEST) {
    return baseEndpoint; // 기본값이므로 파라미터 생략
  }
  
  const separator = baseEndpoint.includes('?') ? '&' : '?';
  return `${baseEndpoint}${separator}sort=${sortParam}`;
}

// 정렬 방식 토글
export function toggleSort(currentSort) {
  return currentSort === SORT_OPTIONS.LATEST 
    ? SORT_OPTIONS.OLDEST 
    : SORT_OPTIONS.LATEST;
}

// 정렬 방식 한글 변환
export function getSortDisplayName(sortType) {
  switch(sortType) {
    case SORT_OPTIONS.LATEST:
      return "최신순";
    case SORT_OPTIONS.OLDEST:
      return "오래된순";
    case SORT_OPTIONS.ALPHABETICAL:
      return "가나다순";
    default:
      return "최신순";
  }
}