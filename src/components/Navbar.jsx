import { NavLink } from "react-router-dom";
import { Mail, PenLine, Inbox, User } from "lucide-react";
import "./navbar.css";

export default function Navbar() {
  const cx = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

  return (
    <nav className="navbar" role="navigation" aria-label="하단 내비게이션">
      <div className="navbar-inner" data-safearea>
        <NavLink to="/letters" className={cx} aria-label="편지방">
          <Mail className="nav-icon" aria-hidden="true" />
          <span className="nav-label">편지방</span>
        </NavLink>

        <NavLink to="/compose" className={cx} aria-label="편지쓰기">
          <PenLine className="nav-icon" aria-hidden="true" />
          <span className="nav-label">편지쓰기</span>
        </NavLink>

        <NavLink to="/mailbox" className={cx} aria-label="수신함">
          <Inbox className="nav-icon" aria-hidden="true" />
          <span className="nav-label">수신함</span>
        </NavLink>

        <NavLink to="/mypage" className={cx} aria-label="마이페이지">
          <User className="nav-icon" aria-hidden="true" />
          <span className="nav-label">마이페이지</span>
        </NavLink>
      </div>
    </nav>
  );
}
