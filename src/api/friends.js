import { get, post, del } from "./api";

/** 친구 목록 조회 */
export const getFriends = () => get(`/friends`);

/** 받은 친구 요청 목록 조회 */
export const getReceivedRequests = () => get(`/friends/requests/received`);

/** 친구 요청 보내기 (payload: { userId } 또는 { username }) */
export const sendFriendRequest = (payload) =>
  post(`/friends/requests`, payload);

/** 친구 요청 수락/거절 */
export const acceptRequest = (requestId) =>
  post(`/friends/requests/${encodeURIComponent(requestId)}/accept`, {});
export const rejectRequest = (requestId) =>
  post(`/friends/requests/${encodeURIComponent(requestId)}/reject`, {});

/** 친구 삭제 */
export const deleteFriend = (friendId) =>
  del(`/friends/${encodeURIComponent(friendId)}`);

/** 즐겨찾기 토글 */
export const setFavorite = (friendId, on = true) =>
  post(`/friends/${encodeURIComponent(friendId)}/favorite`, { favorite: on });
export const unsetFavorite = (friendId) => setFavorite(friendId, false);

/** 아이디/이름 검색 */
export const searchUsers = (q) => get(`/friends/search`, { params: { q } });

/** 친구 프로필(요약) */
export const getFriendProfile = (friendId) =>
  get(`/friends/${encodeURIComponent(friendId)}/profile`);

