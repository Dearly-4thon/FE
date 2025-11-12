// Vite는 ESM이 기본. CommonJS(require/module.exports) 쓰지 마세요.
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  (typeof window !== "undefined" ? `${window.location.origin}/api` : "");

// (선택) 토큰 보관 위치는 프로젝트 규칙에 맞춰 바꾸세요.
function authHeaders() {
  try {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/** 공용 fetch 래퍼: 에러/JSON 처리 통일 */
async function request(path, { method = "GET", headers = {}, body, signal, credentials = "include" } = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials, // 세션쿠키 쓰면 "include"
  });

  // JSON/텍스트 자동 파싱
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const msg = (data && data.message) || res.statusText || "Request failed";
    const err = new Error(`${res.status} ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** 내가 추가한 친구 목록 가져오기 (검색어 옵션) */
export async function fetchMyFriends({ q = "", signal } = {}) {
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  // 서버 엔드포인트 예시: GET /friends?q=...
  return request(`/friends${query}`, { signal });
}

/** 개별 프로필 (Compose에서 제목 보정 등) */
export async function fetchUserProfile(userId, { signal } = {}) {
  if (!userId) throw new Error("userId is required");
  // 예시: GET /users/:id
  return request(`/users/${encodeURIComponent(userId)}`, { signal });
}

export { BASE_URL }; // 디버그/테스트용
