// 테스트용 편지 데이터를 localStorage에 추가하는 스크립트
// 브라우저 콘솔에서 실행하세요

const testLetter = {
  id: Date.now(),
  senderId: 1, // 현재 로그인된 사용자 ID로 변경 필요
  receiverId: 1, // 현재 로그인된 사용자 ID로 변경 필요  
  title: "테스트 편지",
  content: "안녕하세요! 이것은 테스트 편지입니다. 편지 기능이 제대로 작동하는지 확인하기 위한 샘플 텍스트입니다.",
  fontStyle: "basic",
  paperTheme: "white", 
  openAt: "2025-12-31",
  sentAt: new Date().toISOString().split('T')[0],
  locked: false,
  sender: "진세",
  receiver: "진세"
};

// localStorage에 저장
const mailboxData = JSON.parse(localStorage.getItem("dearly-mailbox") || "{}");
if (!mailboxData.letters) {
  mailboxData.letters = {};
}
mailboxData.letters[testLetter.id] = testLetter;
localStorage.setItem("dearly-mailbox", JSON.stringify(mailboxData));

// 업데이트 이벤트 트리거
window.dispatchEvent(new CustomEvent('mailboxUpdate'));

console.log("테스트 편지가 추가되었습니다:", testLetter);