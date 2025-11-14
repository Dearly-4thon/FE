// src/pages/WriteLetter/components/CircleStage.jsx
// WriteLetter_가운데_최종 (수정 반영)
import React, { useMemo } from "react";
import profileSvg from "../../../assets/profile.svg";
import { getCurrentUserNickname } from "../../../utils/userInfo.js";
import "../styles/circle-stage.css";

export default function CircleStage({
  friends,
  demoFriends = true,
  onSelectRecipient,   // (payload) => void
  onSelectSelf,        // () => void
  onSelectFriend,      // (friend) => void
}) {
  // ===== 데모 데이터 =====
  const DUMMY = [
    { id: "f1", name: "조대현", handle: "jo" },
    { id: "f2", name: "강준호", handle: "kang" },
    { id: "f3", name: "김소연", handle: "kim" },
    { id: "f4", name: "박민호", handle: "park" },
    { id: "f5", name: "정유나", handle: "jung" },
    { id: "f6", name: "임승호", handle: "lim" },
    { id: "f7", name: "이지은", handle: "lee" },
    { id: "f8", name: "신하은", handle: "shin" },
  ];
  const list = demoFriends ? DUMMY : (friends ?? []);

  /** ===== 사이즈/간격 기준(기존 유지) ===== */
  const STAGE = 360;
  const CENTER = STAGE / 2;

  const ME_SIZE = 104;
  const FRIEND_OUTER = 64;
  const FRIEND_INNER = 58;
  const FRIEND_PAD = (FRIEND_OUTER - FRIEND_INNER) / 2; // 3px
  const FRIEND_SIZE = FRIEND_OUTER;

  const SIDE_MARGIN = 0.1;
  const ORBIT_R = STAGE / 2 - SIDE_MARGIN - FRIEND_SIZE / 2;

  // 링 반지름
  const RING1 = Math.round(ME_SIZE / 2 + 14);
  const RING2 = Math.round(ORBIT_R);
  const RING3 = RING2 + 72;
  const RINGS = [RING1, RING2, RING3];

  // 친구 8명(12시부터 시계방향)
  const nodes = useMemo(() => {
    const base = list.slice(0, 8);
    return base.map((f, i) => {
      const theta = (2 * Math.PI * i) / 8 - Math.PI / 2;
      return {
        ...f,
        x: CENTER + ORBIT_R * Math.cos(theta),
        y: CENTER + ORBIT_R * Math.sin(theta),
      };
    });
  }, [list, ORBIT_R]);

  // ====== 클릭 핸들러 (콜백 우선순위 보장) ======
  const fireSelect = (payload) => {
    // 1) 단일 콜백 우선
    if (onSelectRecipient) return onSelectRecipient(payload);

    // 2) 분리 콜백
    if (payload?.id === "me" || payload?.type === "self" || payload?.isSelf) {
      return onSelectSelf?.();
    }
    return onSelectFriend?.(payload);
  };

  // self payload 표준화
  const SELF_PAYLOAD = { id: "me", type: "self", name: getCurrentUserNickname(), isSelf: true };

  // friend payload 표준화(Compose에서 필요한 최소 키 확정: id/name/handle)
  const toFriendPayload = (f) => ({
    id: f?.id ?? f?.handle,      // id 우선, 없으면 handle
    name: f?.name ?? "",
    handle: f?.handle,
    type: "friend",
    raw: f,                      // 필요 시 디버그용
  });

  return (
    <div
      className="wl-stage wl-stage--exact"
      style={{
        width: STAGE,
        height: STAGE,
        "--me-size": `${ME_SIZE}px`,
        "--friend-inner": `${FRIEND_INNER}px`,
        "--friend-pad": `${FRIEND_PAD}px`,
        "--friend-size": `${FRIEND_SIZE}px`,
      }}
    >
      {/* 3중 링 */}
      {RINGS.map((r, idx) => (
        <div
          key={r}
          className={`wl-ring ring${idx + 1}`}
          style={{ width: r * 2, height: r * 2, left: CENTER - r, top: CENTER - r }}
        />
      ))}

      {/* 중앙(나) */}
      <button
        type="button"
        className="wl-me-card"
        onClick={() => fireSelect(SELF_PAYLOAD)}
        aria-label="나에게 쓰기"
        style={{ left: CENTER, top: CENTER }}
      >
        {/* 테이프 */}
        <div className="mask mask-tl" />
        <div className="mask mask-tr" />
        <div className="mask mask-bl" />
        <div className="mask mask-br" />

        {/* 바깥 회색 박스 + 내부 흰 정사각 */}
        <div className="wl-me-outer">
          <div className="wl-me-inner">
            <img src={profileSvg} alt="나" className="wl-me-img" />
          </div>
        </div>
        <div className="wl-name">{getCurrentUserNickname()}</div>
      </button>

      {/* 친구들 (64×64 프레임 + 58×58 내부) */}
      {nodes.map((f) => {
        const p = toFriendPayload(f);
        return (
          <button
            key={f.id ?? f.handle}
            type="button"
            className="wl-friend"
            style={{ left: f.x, top: f.y }}
            onClick={() => fireSelect(p)}
            aria-label={`${f.name}에게 쓰기`}
          >
            <div className="wl-friend-frame">
              <div className="wl-friend-inner">
                <img src={profileSvg} alt="" className="wl-friend-img" />
              </div>
            </div>
            <div className="wl-friend-name">{f.name}</div>
          </button>
        );
      })}
    </div>
  );
}
