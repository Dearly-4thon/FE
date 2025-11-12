import { NavLink } from "react-router-dom";
import { Mail, PenLine, Inbox, User } from "lucide-react";
import "./navbar.css";

export default function Navbar() {
    const cx = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

    return (
        <nav className="navbar">
            <div className="navbar-inner">{/* ← CSS와 동일한 클래스명 */}
                <NavLink to="/letters" className={cx} aria-label="편지방">
                    <Mail className="nav-icon" />
                    <span className="nav-label">편지방</span>
                </NavLink>

                <NavLink to="/compose" className={cx} aria-label="편지쓰기">
                    <PenLine className="nav-icon" />
                    <span className="nav-label">편지쓰기</span>
                </NavLink>

                <NavLink to="/inbox" className={cx} aria-label="수신함">
                    <Inbox className="nav-icon" />
                    <span className="nav-label">수신함</span>
                </NavLink>

                <NavLink to="/mypage" className={cx} aria-label="마이페이지">
                    <User className="nav-icon" />
                    <span className="nav-label">마이페이지</span>
                </NavLink>
            </div>
        </nav>
    );
}
