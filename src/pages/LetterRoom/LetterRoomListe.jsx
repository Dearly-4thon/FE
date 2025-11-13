import { useNavigate, useLocation } from "react-router-dom";
import "./LetterRoom.css";

export default function LetterRoomListe() {
  const navigate = useNavigate();
  const location = useLocation();

  const openComposeFor = (e, recipient = { id: "me", name: "나에게" }) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    console.log("openComposeFor -> navigate", { from: location.pathname, to: recipient });
    navigate("/write/compose/full", { state: { from: location.pathname, to: recipient } });
  };

  return (
    <div className="letter-room page">
      <h1>편지방 목록 페이지</h1>

      <div
        className="wl-center"
        role="button"
        tabIndex={0}
        onClick={(e) => openComposeFor(e, { id: "me", name: "디어리" })}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openComposeFor(e, { id: "me", name: "디어리" }); }}
      >
        {/* 카드 내용 */}
      </div>

      <div
        className="wl-chooser-card"
        role="button"
        tabIndex={0}
        onClick={(e) => openComposeFor(e, { id: "friend-1", name: "친구이름" })}
        onKeyDown={(e) => { if (e.key === "Enter") openComposeFor(e, { id: "friend-1", name: "친구이름" }); }}
      >
        {/* 카드 내용 */}
      </div>
    </div>
  );
}
