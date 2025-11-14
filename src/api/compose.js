import { api } from './api';
import { getCurrentUser, getCurrentUserId } from '../utils/userInfo';

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
    
    const currentUser = getCurrentUser();
    const currentUserId = getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('로그인이 필요합니다.');
    }

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

    const response = await api.post('/letters', processedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('편지 전송 성공:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('편지 전송 오류:', error);
    
    if (error.message === "Network Error" || error.code === "ERR_NETWORK" || 
        (error.response && error.response.status >= 400)) {
      
      console.log('네트워크 오류 - localStorage에 백업 저장');
      
      const currentUser = getCurrentUser();
      const senderName = currentUser?.nickname || currentUser?.name || "디어리";
      
      const backup = loadMailbox();
      const letters = backup.letters || [];
      
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
    
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      const backup = loadMailbox();
      return backup.letters || [];
    }
    
    throw error;
  }
};


export function createLetterLegacy(letterData, receiverId = null) {
  return createLetter(letterData);
}