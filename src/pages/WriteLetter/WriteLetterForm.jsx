import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TitleRow from "./components/TitleRow.jsx";
import CircleStage from "./components/CircleStage.jsx";
import ChooserModal from "./components/ChooserModal.jsx";

import "./styles/title-row.css";
import "./styles/circle-stage.css";

export default function WriteLetterForm() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const goSelf = () => nav("/compose/form");

  const goFriend = (friend) => {
    const handle = friend.handle ?? friend.id;
    nav(`/compose/form/friend/${handle}`, {
      state: { friendName: friend.name },
    });
  };

  return (
    <div className="wl-screen">
      <TitleRow title="누구에게 편지를 쓸까요" showQuestion />

      <CircleStage
        demoFriends={true}
        onSelectRecipient={(t) => (t.id === "me" ? goSelf() : goFriend(t))}
      />

      {/* FAB: top 684px / left 24px 고정 */}
      <button
        className="wl-fab"
        onClick={() => setOpen(true)}
        aria-label="친구 목록에서 선택"
      >
        +
      </button>

      {open && <ChooserModal onClose={() => setOpen(false)} />}
    </div>
  );
}
