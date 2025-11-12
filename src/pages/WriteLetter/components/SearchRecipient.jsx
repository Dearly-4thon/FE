// src/pages/WriteLetter/components/SearchRecipient.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import { navToCompose } from "../../../utils/navToCompose";
import "../styles/search-recipient.css";

/**
 * 받는 사람 선택 화면
 * - 친구를 누르면 navToCompose로 컴포즈 화면으로 이동
 * - friends prop이 없으면 DEFAULT 데이터 사용
 * - handle/username 섞여 있어도 안전하게 표시/검색
 */
export default function SearchRecipient({ friends = [] }) {
  const nav = useNavigate();

  // 데모용 기본 데이터
  const DEFAULT = [
    { id: "u1", name: "김소연", handle: "@soyeon_kim" },
    { id: "u2", name: "박민호", handle: "@minho_park" },
    { id: "u3", name: "이지은", handle: "@jieun_lee" },
    { id: "u4", name: "조대현", handle: "@daehyun_cho" },
    { id: "u5", name: "정유나", handle: "@yuna_jung" },
    { id: "u6", name: "강준호", handle: "@junho_kang" },
    { id: "u7", name: "신하은", handle: "@haeun_shin" },
  ];

  // 실제 표출할 원본 배열
  const rows = useMemo(() => (friends?.length ? friends : DEFAULT), [friends]);

  // 다양한 형태의 필드를 통일
  const normalize = useCallback((f) => {
    return {
      id: String(f.id ?? f.userId ?? f._id ?? ""),
      name: String(f.name ?? f.displayName ?? f.fullName ?? ""),
      handle: String(f.handle ?? f.username ?? f.tag ?? ""),
    };
  }, []);

  // 검색
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows.map(normalize);
    return rows
      .map(normalize)
      .filter(
        (f) =>
          f.name.toLowerCase().includes(s) ||
          f.handle.toLowerCase().includes(s) ||
          f.id.toLowerCase().includes(s)
      );
  }, [q, rows, normalize]);

  // 클릭 시 compose로 이동
  const handleClick = useCallback(
    (f) => {
      if (!f.id) return;
      navToCompose(nav, { type: "friend", id: f.id, name: f.name });
    },
    [nav]
  );

  return (
    <div className="rcp-screen">
      {/* 상단 영역 */}
      <header className="rcp-header">
        <h1 className="rcp-title">받는 사람 선택</h1>
        <p className="rcp-sub">누구에게 편지를 보낼까요?</p>

        <div className="rcp-search">
          <Search className="rcp-search-icon" size={18} aria-hidden="true" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="친구 이름 또는 @아이디 검색"
            aria-label="친구 검색"
          />
        </div>
      </header>

      {/* 리스트 */}
      <main className="rcp-list" role="list">
        {filtered.map((f) => (
          <button
            key={f.id}
            className="rcp-item"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(f);
            }}
            role="listitem"
            style={{ pointerEvents: "auto" }}
          >
            <span className="rcp-avatar" aria-hidden="true">
              <User size={18} />
            </span>
            <span className="rcp-texts">
              <span className="rcp-name">{f.name}</span>
              <span className="rcp-handle">{f.handle}</span>
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="rcp-empty">검색 결과가 없어요.</p>
        )}
      </main>
    </div>
  );
}
