// 간단한 localStorage 기반 저장소
const KEY = "dearly_sent_letters";

function _read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function _write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/** 편지 추가 */
export function addSentLetter(letter) {
  const list = _read();
  list.unshift({
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...letter, // {toId, toName, title, content, openDate, images:[]}
  });
  _write(list);
}

/** 전체 목록 / 개수 */
export function getSentLetters() {
  return _read();
}
export function getSentCount() {
  return _read().length;
}

/** 친구별 개수 */
export function getSentCountByFriend(friendId) {
  return _read().filter((x) => String(x.toId) === String(friendId)).length;
}
