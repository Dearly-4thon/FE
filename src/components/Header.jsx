// src/components/Header.jsx
import DearlyLogo from './DearlyLogo';
import './Header.css';
import bellIcon from '../assets/icons/bell.svg';

export default function Header({
  selectedYear,   // 안 쓰긴 하지만 다른 페이지들에서 넘기고 있으니까 받아만 둠
  onYearChange,
  onBack,
  title = 'Dearly',
  showProfile = false,
  onNavigate,
}) {
  const handleNotificationClick = () => {
    if (onNavigate) {
       onNavigate('notifications');
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
            onClick={handleNotificationClick}
          >
            <img src={bellIcon} alt="알림" className="header-bell-icon" />
            <span className="header-bell-badge" />
          </button>
        </div>
      </div>
    </header>
  );
}
