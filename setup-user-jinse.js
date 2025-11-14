// localStorage에 진세 사용자 정보 설정
// 브라우저 콘솔에서 실행하세요

// 사용자 정보 설정
const userInfo = {
  id: 1,
  nickname: "진세",
  name: "진세", 
  username: "jinse"
};

// 여러 형태로 저장
localStorage.setItem('user', JSON.stringify(userInfo));
localStorage.setItem('user_data', JSON.stringify(userInfo));
localStorage.setItem('user_nickname', '진세');
localStorage.setItem('user_name', '진세');
localStorage.setItem('user_id', '1');
localStorage.setItem('nickname', '진세');
localStorage.setItem('name', '진세');

console.log('사용자 정보가 설정되었습니다:', userInfo);

// 테스트 편지도 추가
const testLetter = {
  id: Date.now() + 1,
  senderId: 1,
  receiverId: 1, 
  title: "진세에게 보내는 테스트 편지",
  content: "안녕 진세야! 이것은 테스트 편지야. 이름이 제대로 표시되는지 확인해보자!",
  fontStyle: "basic",
  paperTheme: "white", 
  openAt: "2025-12-31",
  sentAt: new Date().toISOString().split('T')[0],
  locked: false,
  sender: "진세",
  receiver: "진세"
};

const mailboxData = JSON.parse(localStorage.getItem("dearly-mailbox") || "{}");
if (!mailboxData.letters) {
  mailboxData.letters = {};
}
mailboxData.letters[testLetter.id] = testLetter;
localStorage.setItem("dearly-mailbox", JSON.stringify(mailboxData));

// 업데이트 이벤트 트리거
window.dispatchEvent(new CustomEvent('mailboxUpdate'));

console.log("테스트 편지가 추가되었습니다:", testLetter);