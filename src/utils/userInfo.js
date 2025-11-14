// src/utils/userInfo.js
/**
 * 현재 로그인한 사용자 정보를 가져오는 유틸리티 함수들
 */

/**
 * localStorage에서 현재 사용자 정보를 가져옴
 * @returns {Object|null} 사용자 정보 객체 또는 null
 */
export const getCurrentUser = () => {
  try {
    // 여러 키를 시도해서 사용자 정보 찾기
    let userData = null;
    
    // 1. 'user' 키 시도
    const userStr = localStorage.getItem('user');
    if (userStr) {
      userData = JSON.parse(userStr);
    }
    
    // 2. 'user_data' 키 시도
    if (!userData) {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        userData = JSON.parse(userDataStr);
      }
    }
    
    // 3. 개별 필드들로 구성 - 모든 가능한 키 확인
    if (!userData) {
      const possibleKeys = [
        'user_nickname', 'nickname', 'user_name', 'name', 
        'username', 'displayName', 'display_name'
      ];
      
      let nickname = null;
      for (const key of possibleKeys) {
        const value = localStorage.getItem(key);
        if (value && value !== 'null' && value !== 'undefined') {
          nickname = value;
          break;
        }
      }
      
      const userId = localStorage.getItem('user_id') || localStorage.getItem('id');
      
      console.log('localStorage 전체 확인:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
      }
      
      if (nickname || userId) {
        userData = {
          nickname: nickname || '사용자',
          id: userId ? parseInt(userId, 10) : null,
          name: nickname || '사용자'
        };
      }
    }
    
    return userData;
  } catch (error) {
    console.error('사용자 정보 파싱 오류:', error);
    return null;
  }
};

/**
 * 현재 사용자의 닉네임을 가져옴
 * @returns {string} 사용자 닉네임 (기본값: "사용자")
 */
export const getCurrentUserNickname = () => {
  const user = getCurrentUser();
  
  // 실제 로그인 사용자 확인
  console.log('getCurrentUserNickname 호출 - 사용자 정보:', user);
  
  // 다양한 키에서 닉네임 찾기
  const possibleNames = [
    user?.nickname, user?.name, user?.username, user?.displayName,
    localStorage.getItem('user_nickname'),
    localStorage.getItem('nickname'), 
    localStorage.getItem('user_name'),
    localStorage.getItem('name'),
    localStorage.getItem('username')
  ].filter(Boolean);
  
  const finalName = possibleNames[0] || "사용자";
  console.log('최종 사용자 이름:', finalName);
  
  return finalName;
};

/**
 * 현재 사용자의 ID를 가져옴
 * @returns {number|null} 사용자 ID
 */
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  const userId = user?.id || localStorage.getItem('user_id');
  return userId ? parseInt(userId, 10) : null;
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem('accessToken');
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * 현재 사용자 정보 요약 (디버깅용)
 * @returns {Object} 사용자 정보 요약
 */
export const getUserSummary = () => {
  const user = getCurrentUser();
  const token = localStorage.getItem('accessToken');
  
  return {
    isLoggedIn: isLoggedIn(),
    hasToken: !!token,
    hasUserData: !!user,
    nickname: getCurrentUserNickname(),
    userId: getCurrentUserId(),
    user: user
  };
};