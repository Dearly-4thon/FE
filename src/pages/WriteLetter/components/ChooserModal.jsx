// src/pages/WriteLetter/components/ChooserModal.jsx
import { X, Image as ImageIcon, User as UserIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/chooser-modal.css";

export default function ChooserModal({ onClose }) {
  const nav = useNavigate();

  const go = (path) => {
    nav(path);
    setTimeout(onClose, 50);
  };

  return (
    <div className="wl-chooser-overlay" onClick={onClose}>
      <div className="wl-chooser" onClick={(e) => e.stopPropagation()}>
        <button className="wl-chooser-close" onClick={onClose}><X size={18} /></button>

        <div className="wl-chooser-head">
          <div className="wl-chooser-floating"><ImageIcon size={26} /></div>
          <div className="wl-chooser-title">누구에게 편지를 쓸까요?</div>
          <div className="wl-chooser-sub">특별한 메시지를 전해보세요 💌</div>
        </div>

        <div className="wl-chooser-body">
          <button className="wl-chooser-card" onClick={() => go("/compose/form")}>
            <div className="wl-chooser-card-icon red"><UserIcon size={24} /></div>
            <div className="wl-chooser-card-text">
              <div className="tit">나에게 쓰기 ✍️</div>
              <div className="sub">미래의 나에게 남기는 메시지</div>
            </div>
          </button>

          <button className="wl-chooser-card" onClick={() => go("/compose/select")}>
            <div className="wl-chooser-card-icon blue"><Users size={24} /></div>
            <div className="wl-chooser-card-text">
              <div className="tit">친구에게 쓰기 💖</div>
              <div className="sub">친구에게 전하는 특별한 메시지</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
