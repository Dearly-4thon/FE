import { NavLink } from "react-router-dom";
import { Mail, PenLine, Inbox, User } from "lucide-react";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/letters",  label: "편지방",   Icon: Mail   },
  { to: "/compose",  label: "편지쓰기", Icon: PenLine }, // 기본 탭: WriteLetterForm
  { to: "/inbox",    label: "수신함",   Icon: Inbox  },
  { to: "/mypage",   label: "마이페이지", Icon: User  },
];

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="하단 탭">
      <div className="navbar-inner">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/letters"}
            className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
          >
            <Icon className="nav-icon" aria-hidden="true" />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
