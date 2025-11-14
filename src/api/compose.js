import { api } from "./api";

// 편지 작성 관련 API
export function createLetter(letterData, receiverId = null) {
  const endpoint = receiverId 
    ? `/letters/?receiver_id=${receiverId}`
    : `/letters/`;
    
  return api.post(endpoint, letterData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}