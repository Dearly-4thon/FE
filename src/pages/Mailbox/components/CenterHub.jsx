import React, { useMemo } from "react";
import profileSvg from "../../../assets/profile.svg";
import "./styles/center-hub.css";

export default function CenterHub({
  favorites = [],
  demo = true,
  onSelectSelf,
  onSelectFriend,
  top = 244.67,
}) {
  const DUMMY = [
    { id: 1, name: "조대현" },
    { id: 2, name: "강준호" },
    { id: 3, name: "김소연" },
    { id: 4, name: "박민호" },
    { id: 5, name: "정유나" },
    { id: 6, name: "임승호" },
    { id: 7, name: "이지은" },
    { id: 8, name: "신하은" },
  ];
  const list = (demo ? (favorites?.length ? favorites : DUMMY) : favorites) ?? [];

  /** ========= 크기 (전반적 축소, 요구 스펙 반영) ========= */
  const STAGE = 360; // 359.987과 동일 취급
  const CENTER = STAGE / 2;

  const ME_SIZE = 104;            // 중앙카드
  const FRIEND_OUTER = 57.997;    // 바깥 프레임(카드 전체)
  const FRIEND_INNER = 52.899;    // 내부 노란 정사각
  const FRIEND_PAD = (FRIEND_OUTER - FRIEND_INNER) / 2; // ≈ 2.549px
  const FRIEND_SIZE = FRIEND_OUTER;

  const ORBIT_R = (STAGE / 2) - (FRIEND_SIZE / 2); // 친구 궤도

  // 링 크기: 160 / 260 / 359.987
  const RING1 = 80;                 // 지름 160
  const RING2 = 130;                // 지름 260
  const RING3 = 359.987 / 2;        // 지름 359.987
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

  // 공통: 클릭 이벤트 전파 차단
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="wl-stage wl-stage--exact"
      style={{
        top,
        left: "50%",
        transform: "translateX(-50%)",
        width: STAGE,
        height: STAGE,
        "--me-size": `${ME_SIZE}px`,
        "--friend-inner": `${FRIEND_INNER}px`,
        "--friend-pad": `${FRIEND_PAD}px`,
        "--friend-size": `${FRIEND_SIZE}px`,
      }}
      aria-label="수신함 중앙 오비트"
    >
      {/* 배경 데코 원형 3개 (맥박) */}
      <div className="wl-deco-circles">
        <div className="deco deco-1" />
        <div className="deco deco-2" />
        <div className="deco deco-3" />
      </div>


      {/* 중앙(나) */}
      <button
        type="button"
        className="wl-me-card"
        aria-label="나에게 쓴 편지 보기"
        style={{ left: CENTER, top: CENTER }}
        onClick={(e) => {
          stop(e);
          onSelectSelf?.();
        }}
      >
        <div className="mask mask-tl" />
        <div className="mask mask-tr" />
        <div className="mask mask-bl" />
        <div className="mask mask-br" />

        <div className="wl-me-outer">
          <div className="wl-me-inner">
            <img src={profileSvg} alt="나" className="wl-me-img" />
          </div>
        </div>
        <div className="wl-name">디어리</div>
      </button>

      {/* 친구 카드 */}
      {nodes.map((f) => (
        <button
          key={f.id}
          type="button"
          className="wl-friend"
          style={{ left: f.x, top: f.y }}
          aria-label={`${f.name}의 편지 보기`}
          onClick={(e) => {
            stop(e);
            onSelectFriend?.(f);
          }}
        >
          <div className="wl-friend-frame">
            <div className="wl-friend-inner">
              <img src={profileSvg} alt="" className="wl-friend-img" />
            </div>
          </div>
          <div className="wl-friend-name">{f.name}</div>
        </button>
      ))}
    </div>
  );
}
