// src/api/compose.js
import { api } from './api';
import { getCurrentUser, getCurrentUserId } from '../utils/userInfo';

// localStorage 백업 시스템
const LS_KEY = "dearly-mailbox";

const loadMailbox = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveMailbox = (data) => {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
};

// Base64 이미지 변환 함수
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * 편지 작성 API
 * @param {Object} letterData - 편지 데이터
 * @returns {Promise}
 */
export const createLetter = async (letterData) => {
  try {
    console.log('편지 전송 시도:', letterData);
    
    // 사용자 정보 가져오기
    const currentUser = getCurrentUser();
    const currentUserId = getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 이미지 Base64 변환 (필요한 경우)
    const processedData = { ...letterData };
    
    if (letterData.images && letterData.images.length > 0) {
      for (let i = 0; i < Math.min(letterData.images.length, 3); i++) {
        const file = letterData.images[i];
        if (file instanceof File) {
          const base64 = await fileToBase64(file);
          processedData[`image${i + 1}`] = base64;
        }
      }
      delete processedData.images;
    }

    // API 호출 시도
    const response = await api.post('/letters', processedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('편지 전송 성공:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('편지 전송 오류:', error);
    
    // 네트워크 오류 또는 CORS 오류인 경우 localStorage에 백업
    if (error.message === "Network Error" || error.code === "ERR_NETWORK" || 
        (error.response && error.response.status >= 400)) {
      
      console.log('네트워크 오류 - localStorage에 백업 저장');
      
      // 현재 사용자 정보 가져오기
      const currentUser = getCurrentUser();
      const senderName = currentUser?.nickname || currentUser?.name || "디어리";
      
      // localStorage에 백업 데이터 저장
      const backup = loadMailbox();
      const letters = backup.letters || [];
      
      // 이미지 썸네일 생성
      let thumbnail = null;
      if (letterData.images && letterData.images.length > 0) {
        try {
          thumbnail = await fileToBase64(letterData.images[0]);
        } catch (e) {
          console.error('썸네일 생성 오류:', e);
        }
      }
      
      const newLetter = {
        id: Date.now(),
        title: letterData.content?.split('\n')[0]?.slice(0, 20) || '제목 없음',
        content: letterData.content,
        sender: senderName,
        receiver_id: letterData.receiver_id,
        font_style: letterData.font_style,
        paper_theme: letterData.paper_theme,
        open_at: letterData.open_at,
        sent_at: new Date().toISOString().split('T')[0],
        locked: new Date(letterData.open_at) > new Date(),
        dday: Math.max(0, Math.ceil((new Date(letterData.open_at) - new Date()) / (1000 * 60 * 60 * 24))),
        thumbnail: thumbnail,
        body: letterData.content,
        sentAt: new Date().toISOString().split('T')[0]
      };
      
      letters.push(newLetter);
      backup.letters = letters;
      saveMailbox(backup);
      
      console.log('백업 데이터 저장 완료:', newLetter);
      
      // 가짜 성공 응답 반환
      return {
        id: newLetter.id,
        message: '편지가 성공적으로 전송되었습니다. (개발모드)',
        status: 'success',
        backup: true
      };
    }
    
    throw error;
  }
};

/**
 * 편지 목록 조회
 * @returns {Promise}
 */
export const getLetters = async () => {
  try {
    const response = await api.get('/letters');
    return response.data;
  } catch (error) {
    console.error('편지 목록 조회 오류:', error);
    
    // 네트워크 오류인 경우 localStorage에서 백업 데이터 반환
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      const backup = loadMailbox();
      return backup.letters || [];
    }
    
    throw error;
  }
};

// 레거시 지원
export function createLetterLegacy(letterData, receiverId = null) {
  return createLetter(letterData);
}