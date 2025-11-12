import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import PageHeader from "./PageHeader.jsx";
import "../styles/page-header.css";
import { fetchJSON } from "../../../lib/api"; // 앞서 만든 공용 fetch 유틸

// 폴백 더미(개발/오프라인용) - 백엔드 스키마에 맞춤
const DUMMY = Object.freeze([
  { id: 1, username: "soyeon_kim", nickname: "김소연" },
  { id: 2, username: "minho_park", nickname: "박민호" },
  { id: 3, username: "jieun_lee", nickname: "이지은" },
  { id: 4, username: "daehyun_cho", nickname: "조대현" },
  { id: 5, username: "yuna_jung", nickname: "정유나" },
  { id: 6, username: "junho_kang", nickname: "강준호" },
  { id: 7, username: "haeun_shin", nickname: "신하은" },
]);

// 서버 응답을 화면 모델로 정규화
function normalize(u) {
  // name: 표시용(닉네임 우선), handle: 라우팅/검색용 username
  return {
    key: u.id ?? u.username,
    name: u.nickname && String(u.nickname).trim() ? u.nickname : u.username,
    handle: u.username,
  };
}

export default function SearchRecipient() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]); // normalized array
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setErr(null);

      // 진행 중 요청 취소
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        // ✔ 서버가 "내 친구만" 반환하는 Friends API (검색은 서버에서 처리)
        const data = await fetchJSON("/api/friends", {
          params: q ? { search: q } : undefined,
          signal: ctrl.signal,
        });

        const safe = Array.isArray(data) ? data : [];
        setItems(safe.map(normalize));
      } catch (e) {
        // 폴백: 더미 + 클라 필터
        const base = DUMMY.map(normalize);
        const kw = q.trim().toLowerCase();
        const filtered = kw
          ? base.filter(
              (u) =>
                u.name.toLowerCase().includes(kw) ||
                u.handle.toLowerCase().includes(kw)
            )
          : base;
        setItems(filtered);
        setErr(e);
      } finally {
        setLoading(false);
      }
    }, 250); // 디바운스

    return () => clearTimeout(timer);
  }, [q]);

  const list = useMemo(() => items ?? [], [items]);

  return (
    <div className="wl-screen plain">
      <PageHeader title="받는 사람 선택" />
      <div style={{ padding: "0 16px", color: "#9B8579", marginTop: -6 }}>
        누구에게 편지를 보낼까요?
      </div>

      {/* 검색 인풋 */}
      <div style={{ padding: "14px 16px 6px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 44,
            border: "1px solid #F0D5CC",
            borderRadius: 12,
            padding: "0 12px",
            background: "#fff",
          }}
        >
          <Search size={18} color="#9B8579" />
          <input
            placeholder="친구 이름(닉네임) 또는 @아이디 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* 리스트 */}
      <div style={{ padding: "8px 16px 96px", display: "grid", gap: 10 }}>
        {loading && (
          <div
            style={{
              padding: "18px 12px",
              textAlign: "center",
              color: "#9B8579",
              background: "#fff",
              border: "1.5px solid #F0D5CC",
              borderRadius: 12,
            }}
          >
            불러오는 중…
          </div>
        )}

        {!loading && list.length === 0 && (
          <div
            style={{
              padding: "18px 12px",
              textAlign: "center",
              color: "#9B8579",
              background: "#fff",
              border: "1.5px solid #F0D5CC",
              borderRadius: 12,
            }}
          >
            검색 결과가 없어요.
          </div>
        )}

        {!loading &&
          list.map((u) => (
            <button
              key={u.key}
              onClick={() => nav(`/compose/write/friend/${u.handle}`, { state: { friendName: u.name } })}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 16,
                background: "#fff",
                border: "1.5px solid #F0D5CC",
                boxShadow: "0 6px 12px rgba(0,0,0,.04)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  background: "#ffeaa1",
                  display: "grid",
                  placeItems: "center",
                  color: "#4A3428",
                }}
              >
                <User size={18} />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700 }}>{u.name}</div>
                <div style={{ color: "#9B8579", fontSize: 13 }}>@{u.handle}</div>
              </div>
            </button>
          ))}
        {!!err && (
          <div style={{ color: "#cc5b5b", fontSize: 12, textAlign: "center" }}>
            (네트워크 오류로 데모 데이터로 표시 중)
          </div>
        )}
      </div>
    </div>
  );
}
