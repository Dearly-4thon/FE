// localStorage 디버깅 도구
console.log('=== localStorage 전체 내용 ===');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

// 사용자 관련 키들만 필터링
console.log('=== 사용자 관련 키들 ===');
const userKeys = ['user', 'user_data', 'user_nickname', 'user_id', 'user_name', 'nickname', 'name', 'username'];
userKeys.forEach(key => {
  const value = localStorage.getItem(key);
  if (value) {
    console.log(`${key}: ${value}`);
    try {
      const parsed = JSON.parse(value);
      console.log(`${key} (parsed):`, parsed);
    } catch (e) {
      // JSON이 아닌 경우 그냥 출력
    }
  }
});