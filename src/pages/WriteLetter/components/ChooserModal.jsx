import { X, Image as ImageIcon, User as UserIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../styles/chooser-modal.css";

export default function ChooserModal({ onClose }) {
  const nav = useNavigate();

  const go = (path) => {
    nav(path);
    setTimeout(onClose, 50);
  };

  const modal = (
    <div className="wl-chooser-overlay" onClick={onClose}>
      <div className="wl-chooser" onClick={(e) => e.stopPropagation()}>
        <button className="wl-chooser-close" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>

        <div className="wl-chooser-head">
          <div className="wl-chooser-floating"><ImageIcon size={26} /></div>
          <h3 className="wl-chooser-title">누구에게 편지를 쓸까요?</h3>
          <p className="wl-chooser-sub">특별한 메시지를 전해보세요 💌</p>
        </div>

        <div className="wl-chooser-body">
          {/* 나에게 쓰기 */}
          <div
            className="wl-option"
            role="button"
            tabIndex={0}
            onClick={() => go("/compose/form")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go("/compose/form")}
          >
            <div className="wl-option-stack">
              <div className="wl-option-icon red">
                <UserIcon size={24} />
              </div>
              <div>
                <h4 className="wl-option-title">나에게 쓰기 ✍️</h4>
                <p className="wl-option-sub">미래의 나에게 남기는 메시지</p>
              </div>
            </div>
          </div>

          {/* 친구에게 쓰기 */}
          <div
            className="wl-option"
            role="button"
            tabIndex={0}
            onClick={() => go("/compose/select")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go("/compose/select")}
          >
            <div className="wl-option-stack">
              <div className="wl-option-icon blue">
                <Users size={24} />
              </div>
              <div>
                <h4 className="wl-option-title">친구에게 쓰기 💞</h4>
                <p className="wl-option-sub">친구에게 전하는 특별한 메시지</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
