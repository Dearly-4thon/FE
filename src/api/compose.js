import { api } from "./api";

// 편지 작성 관련 API - 스웨거 POST /letters/ 명세에 맞춤
export function createLetter(letterData) {
  console.log("🔗 API 호출:", "POST /letters/", letterData);
  
  return api.post('/letters/', letterData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}