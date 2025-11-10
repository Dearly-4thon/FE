import React from "react";
import { NavLink } from "react-router-dom";
import { Mail, PenLine, Inbox, User } from "lucide-react";
import "./Navbar.css";

const NAV_ITEMS = [
  { path: "/letters", label: "편지방", Icon: Mail },
  { path: "/write", label: "편지쓰기", Icon: PenLine },
  { path: "/inbox", label: "수신함", Icon: Inbox },
  { path: "/mypage", label: "마이페이지", Icon: User },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
