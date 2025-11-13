import React from "react";

interface HeaderProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  onNavigate?: (page: string, params?: any) => void;
  onBack?: () => void;
  title?: string;
  showProfile?: boolean;
}

export default function Header({
  selectedYear,
  onYearChange,
  onNavigate,
  onBack,
  title,
  showProfile,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-transparent">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="뒤로가기" className="p-2">
            ←
          </button>
        )}
        <div>
          <div className="text-sm font-semibold text-[#1e3a8a]">{title ?? "편지"}</div>
          {typeof selectedYear === "number" && (
            <div className="text-xs text-[#9B8579]">연도: {selectedYear}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showProfile && (
          <button onClick={() => onNavigate?.("profile")} className="w-8 h-8 rounded-full bg-[#FFF4CC]" aria-label="프로필">
            {/* 간단한 프로필 플레이스홀더 */}
          </button>
        )}
      </div>
    </header>
  );
}