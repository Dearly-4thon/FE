import { api } from "./api";

// 메일박스 목록 조회 관련 API
// 받은편지 목록 조회
export function getInbox(sort = "latest") {
  const endpoint = sort === "latest" 
    ? `/letters/inbox/`
    : `/letters/inbox/?sort=${sort}`;
  return api.get(endpoint);
}

// 보낸편지 목록 조회
export function getSent(sort = "latest") {
  const endpoint = sort === "latest"
    ? `/letters/inbox/?box=sent`
    : `/letters/inbox/?box=sent&sort=${sort}`;
  return api.get(endpoint);
}

// 나에게 쓴 편지 목록 조회
export function getSelfLetters(sort = "latest") {
  const endpoint = sort === "latest"
    ? `/letters/self/`
    : `/letters/self/?sort=${sort}`;
  return api.get(endpoint);
}

// 특정 친구와 주고받은 편지 조회
export function getPartnerLetters(partnerId, sort = "latest") {
  const endpoint = sort === "latest"
    ? `/letters/inbox/?partner_id=${partnerId}`
    : `/letters/inbox/?partner_id=${partnerId}&sort=${sort}`;
  return api.get(endpoint);
}