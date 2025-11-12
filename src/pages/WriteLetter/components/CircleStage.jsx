import React, { useMemo } from "react";
import profileSvg from "../../../assets/profile.svg";

export default function CircleStage({
  friends,
  demoFriends = true,
  onSelectRecipient,
}) {
  const DUMMY = [
    { id: 1, name: "조대현", handle: "jo" },
    { id: 2, name: "강준호", handle: "kang" },
    { id: 3, name: "김소연", handle: "kim" },
    { id: 4, name: "박민호", handle: "park" },
    { id: 5, name: "정유나", handle: "jung" },
    { id: 6, name: "임승호", handle: "lim" },
    { id: 7, name: "이지은", handle: "lee" },
    { id: 8, name: "신하은", handle: "shin" },
  ];
  const list = demoFriends ? DUMMY : (friends ?? []);

  const STAGE = 420;                 // 전체 스테이지
  const CENTER = STAGE / 2;
  const ORBIT_R = 170;               // 친구 배치 반지름
  const RINGS = [130, 170, 210];     // 3중 링 반지름

  const nodes = useMemo(() => {
    const base = list.slice(0, 8);
    return base.map((f, i) => {
      const theta = (2 * Math.PI * i) / 8 - Math.PI / 2; // 위쪽부터
      return {
        ...f,
        x: CENTER + ORBIT_R * Math.cos(theta),
        y: CENTER + ORBIT_R * Math.sin(theta),
      };
    });
  }, [friends, demoFriends]);

  return (
    <div className="wl-stage" style={{ width: STAGE, height: STAGE }}>
      {/* 3중 링 */}
      {RINGS.map((r, idx) => (
        <div
          key={r}
          className={`wl-ring ring${idx + 1}`}
          style={{ width: r * 2, height: r * 2, left: CENTER - r, top: CENTER - r }}
        />
      ))}

      {/* 중앙(나에게) */}
      <button
        className="wl-me-card"
        onClick={() => onSelectRecipient?.({ id: "me", name: "디어리" })}
        aria-label="나에게 쓰기"
        style={{ left: CENTER, top: CENTER }}
      >
        <div className="wl-me-imgbox">
          {/* placeholder 아이콘 (필요시 교체 가능) */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A3A3A3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="14" rx="2" />
            <path d="M3 17l6.5-6.5a2 2 0 0 1 2.8 0L21 20" />
            <circle cx="8.5" cy="8.5" r="2" />
          </svg>
        </div>
        <div className="wl-name">디어리</div>
      </button>

      {/* 친구들 */}
      {nodes.map((f) => (
        <button
          key={f.id}
          className="wl-friend"
          style={{ left: f.x, top: f.y }}
          onClick={() => onSelectRecipient?.(f)}
          aria-label={`${f.name}에게 쓰기`}
        >
          <div className="wl-friend-avatar">
            <img src={profileSvg} alt="" className="wl-friend-img" />
          </div>
          <div className="wl-friend-name">{f.name}</div>
        </button>
      ))}
    </div>
  );
}
