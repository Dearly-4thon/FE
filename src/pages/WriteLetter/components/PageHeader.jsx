import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import "../styles/page-header.css";

/**
 * props
 * - title: 헤더 제목
 * - showBack: 뒤로가기 버튼 표시 (기본 true)
 * - showInfo: i(도움말) 버튼 표시 (기본 true)
 * - showQuestion: 제목 끝에 ? 표시 (기본 false)
 * - onInfo: i 버튼 클릭 핸들러
 */
export default function PageHeader({
  title = "",
  showBack = true,
  showInfo = true,
  showQuestion = false,
  onInfo,
}) {
  const nav = useNavigate();

  return (
    <div className="wl-page-header"></div>
  );
}
