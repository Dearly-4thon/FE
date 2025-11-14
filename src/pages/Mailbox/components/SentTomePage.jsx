// src/pages/Mailbox/components/SentToMePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowUpDown, Send, Mail } from "lucide-react";
import { getSelfLetters } from "../../../api/mailbox";
import "../styles/sent-to-me.css";

export default function SentToMePage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");
  const [selfLetters, setSelfLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSort = () => {
    setSort((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  const goWriteLetter = () => {
    // ⭐ 편지쓰기 버튼 → 편지쓰기 메인 (WriteLetterForm.jsx)
    navigate("/write");
  };

  // 임시 목업 데이터로 테스트 (백엔드 서버 연결 안될 때)
  useEffect(() => {
    const fetchSelfLetters = async () => {
      try {
        setLoading(true);
        
        // 백엔드 서버 연결 시도
        const response = await getSelfLetters(sort === "latest" ? "latest" : "oldest");
        console.log("나에게 쓴 편지 API 응답:", response.data);
        
        // API 응답 데이터를 UI에 맞게 변환
        const transformedData = (response.data || []).map(letter => ({
          id: letter.id,
          title: letter.content?.slice(0, 20) || "제목 없음",
          content: letter.content,
          isLocked: !letter.is_open,
          openDate: letter.open_at ? new Date(letter.open_at).toLocaleDateString() : "",
          daysLeft: letter.is_open ? 0 : Math.max(0, Math.ceil((new Date(letter.open_at) - new Date()) / (1000 * 60 * 60 * 24))),
          font: letter.font_style?.toLowerCase() || "basic",
          paper: letter.paper_theme?.toLowerCase() || "white",
          createdAt: letter.created_at
        }));
        
        setSelfLetters(transformedData);
        setError(null);
      } catch (err) {
        console.error("❌ 나에게 쓴 편지 API 에러:", err);
        
        // 임시 목업 데이터로 대체 (개발/테스트용)
        console.log("🔄 임시 목업 데이터 사용 중...");
        const mockData = [
          {
            id: 1,
            title: "2024년 말의 나에게",
            content: "안녕, 미래의 나야. 지금은 2024년 12월이야. 새해가 되면 너는 어떤 모습일까?",
            isLocked: true,
            openDate: "2025.01.01",
            daysLeft: 18,
            font: "cute",
            paper: "pink",
            createdAt: "2024-12-14"
          },
          {
            id: 2,
            title: "취업 준비하는 나에게",
            content: "힘내자! 지금은 힘들지만 분명히 좋은 결과가 있을 거야.",
            isLocked: false,
            openDate: "2024.12.01",
            daysLeft: 0,
            font: "handwriting",
            paper: "beige",
            createdAt: "2024-11-01"
          }
        ];
        
        setSelfLetters(mockData);
        setError(null); // 에러 상태 해제
      } finally {
        setLoading(false);
      }
    };

    fetchSelfLetters();
  }, [sort]); // sort가 변경될 때마다 다시 불러오기

  return (
    <div className="stm-container">
      {/* 헤더 */}
      <header className="stm-header">
        <button className="stm-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>

        <div className="stm-titles">
          <h1 className="stm-title">나에게 보낸 편지</h1>
          <p className="stm-count">
            {loading ? "불러오는 중..." : `총 ${selfLetters.length}개`}
          </p>
        </div>

        <button className="stm-sort-btn" onClick={toggleSort} disabled={loading}>
          <ArrowUpDown size={16} />
          <span>{sort === "latest" ? "최신순" : "오래된순"}</span>
        </button>
      </header>

      {/* 로딩 상태 */}
      {loading && (
        <section className="stm-loading">
          <p>편지 목록을 불러오는 중...</p>
        </section>
      )}

      {/* 에러 상태 */}
      {error && (
        <section className="stm-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </section>
      )}

      {/* 편지 목록 */}
      {!loading && !error && selfLetters.length > 0 && (
        <section className="stm-letters-list">
          {selfLetters.map((letter) => (
            <div key={letter.id} className={`stm-letter-card ${letter.isLocked ? 'locked' : 'opened'}`}>
              {letter.isLocked ? (
                <div className="stm-locked-content">
                  <div className="stm-lock-header">
                    <span className="stm-d-day">D-{letter.daysLeft}</span>
                  </div>
                  <div className="stm-lock-icon">🔒</div>
                  <p className="stm-open-date">{letter.openDate}에 공개</p>
                </div>
              ) : (
                <div className="stm-opened-content">
                  <h3 className="stm-letter-title">{letter.title}</h3>
                  <p className="stm-letter-excerpt">{letter.content?.slice(0, 100)}...</p>
                  <span className="stm-open-date">{letter.openDate}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 빈 상태 박스 */}
      {!loading && !error && selfLetters.length === 0 && (
        <section className="stm-empty-box">
          <div className="stm-empty-circle">
            <Send size={40} className="stm-empty-icon" />
          </div>

          <p className="stm-empty-main">나에게 보낸 편지가 없어요.</p>
          <p className="stm-empty-sub">미래의 나에게 편지를 보내보세요 ✍️</p>

          <button className="stm-write-btn" onClick={goWriteLetter}>
            <Mail size={18} />
            <span>편지 쓰기</span>
          </button>
        </section>
      )}
    </div>
  );
}
