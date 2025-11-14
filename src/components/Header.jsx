// src/components/Header.jsx
import { useNavigate, useLocation } from "react-router-dom";
import DearlyLogo from "./DearlyLogo";
import "./Header.css";
import bellIcon from "../assets/icons/bell.svg";

export default function Header({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNotificationClick = () => {
    if (typeof onNavigate === "function") {
      onNavigate("notifications");
      return;
    }
    if (location.pathname !== "/notifications") {
      navigate("/notifications");
    }
  };

  return (
    <header className="dearly-header">
      <div className="dearly-header-inner">
        {/* 왼쪽 로고 */}
        <div className="dearly-header-left">
          <DearlyLogo />
        </div>

        {/* 오른쪽 알림 벨 */}
        <div className="dearly-header-right">
          <button
            type="button"
            className="header-bell-btn"
            aria-label="알림"
            onClick={handleNotificationClick}
          >
            <img src={bellIcon} alt="" className="header-bell-icon" />
            <span className="header-bell-badge" />
          </button>
        </div>
      </div>
    </header>
  );
}
