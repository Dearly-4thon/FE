// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import "./Navbar.css";

import mailIcon from "../assets/icons/mail.svg";
import penIcon from "../assets/icons/pen-line.svg";
import inboxIcon from "../assets/icons/inbox.svg";
import userIcon from "../assets/icons/user.svg";

const NAV_ITEMS = [
  { to: "/letters", label: "편지방", icon: mailIcon },
  { to: "/write", label: "편지쓰기", icon: penIcon },
  { to: "/mailbox", label: "수신함", icon: inboxIcon },
  { to: "/mypage", label: "마이페이지", icon: userIcon },
];

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="하단 탭">
      <div className="navbar-inner">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/letters"}
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            <img src={icon} className="nav-icon" alt="" aria-hidden="true" />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
