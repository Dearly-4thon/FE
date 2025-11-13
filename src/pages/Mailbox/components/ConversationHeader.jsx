import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "../styles/conversation-header.css";

export default function ConversationHeader({
  title,
  subtitle,
  onBack,
  onInfo,
}) {
  const nav = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  // Mailbox.jsx에서 navigate로 넘긴 값
  const passedName = location.state?.recipientName;
  const isSelfState = location.state?.isSelf === true;

  // 새로고침/직접접속 대비: URL의 :slug를 폴백으로 사용
  const slugName = slug ? decodeURIComponent(slug) : undefined;

  // 최종 이름 결정
  const name =
    isSelfState
      ? "나"
      : (passedName || slugName);

  // 자동 제목 생성
  const autoTitle = name
    ? (String(name).toLowerCase() === "me" || name === "나"
        ? "나에게 쓰는 편지"
        : `${name}에게 쓰는 편지`)
    : "대화";

  const finalTitle = title ?? autoTitle;

  const handleBack = onBack ?? (() => nav(-1));
  const handleInfo = onInfo ?? (() => {});

  return (
    <header className="mbx-conv-header">
      <button className="mbx-back" onClick={handleBack} aria-label="뒤로가기">←</button>
      <div className="mbx-titles">
        <h2 className="mbx-title">{finalTitle}</h2>
        {subtitle && <p className="mbx-sub">{subtitle}</p>}
      </div>
      <button className="mbx-info" onClick={handleInfo} aria-label="정보">i</button>
    </header>
  );
}
