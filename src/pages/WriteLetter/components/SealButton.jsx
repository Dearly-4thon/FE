import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 봉인하기 버튼 (재사용 컴포넌트)
 * - onSeal?: () => Promise<void> | void  (저장/검증 등 비동기 가능)
 * - to?: string  (완료 후 이동 경로, 기본: '/inbox')
 * - disabled?: boolean
 * - children: 버튼 라벨 커스터마이즈
 */
export default function SealButton({
  onSeal,
  to = "/inbox",
  disabled = false,
  children = "봉인하기",
}) {
  const navigate = useNavigate();

  const handleClick = useCallback(async () => {
    if (disabled) return;
    try {
      if (onSeal) {
        await onSeal();
      }
      // 저장 이벤트가 있다면 트리거 (선택)
      window.dispatchEvent(new Event("lettersChanged"));
      navigate(to);
    } catch (e) {
      console.error(e);
      alert("저장 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
    }
  }, [disabled, onSeal, to, navigate]);

  return (
    <button
      type="button"
      className="submit-button"
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
