// src/pages/WriteLetter/WriteLetterForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { navToCompose } from "../../utils/navToCompose.js";

import TitleRow from "./components/TitleRow.jsx";
import CircleStage from "./components/CircleStage.jsx";
import ChooserModal from "./components/ChooserModal.jsx";

import "./styles/base.css";
import "./styles/title-row.css";
import "./styles/circle-stage.css";

export default function WriteLetterForm() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  /** =========================
   * 이동 핸들러
   ========================== */
  const goSelf = () => navToCompose(nav, { type: "self" });

  const goFriend = (friend) => {
    if (!friend) return;
    const id = friend.id ?? friend.handle; // id 우선, 없으면 handle 사용
    const name = friend.name ?? "";
    if (!id) {
      console.warn("[WriteLetterForm] friend 식별자가 없음:", friend);
      return;
    }
    navToCompose(nav, { type: "friend", id, name });
  };

  /** =========================
   * 모달 열릴 때 body 스크롤 잠금
   ========================== */
  useEffect(() => {
    if (open) document.body.classList.add("body-lock");
    else document.body.classList.remove("body-lock");
    return () => document.body.classList.remove("body-lock");
  }, [open]);

  /** =========================
   * 렌더링
   ========================== */
  return (
    <div className="wl-screen">
      {/* 제목줄 */}
      <TitleRow title="누구에게 편지를 쓸까요" showQuestion />

      {/* 친구 원형 스테이지 */}
      <CircleStage
        demoFriends={true}
        onSelectRecipient={(t) =>
          t?.id === "me" || t?.type === "self" || t?.isSelf ? goSelf() : goFriend(t)
        }
        onSelectSelf={goSelf}
        onSelectFriend={goFriend}
      />

      {/* + 버튼 (친구목록 선택 모달) */}
      <button
        className="wl-fab"
        onClick={() => setOpen(true)}
        aria-label="친구 목록에서 선택"
        type="button"
      >
        +
      </button>

      {/* 친구선택 모달 */}
      {open && (
        <div
          className="wl-overlay"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="wl-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <ChooserModal onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
