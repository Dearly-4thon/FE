// src/pages/Mailbox/components/SentToMePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowUpDown, Send, Mail } from "lucide-react";
import { getSelfLetters } from "../../../api/mailbox";
import { getCurrentUser, getCurrentUserNickname, getCurrentUserId } from "../../../utils/userInfo";
import "../styles/sent-to-me.css";

const LS_KEY = "dearly-mailbox";

const loadMailbox = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

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

  // localStorage에서 나에게 보낸 편지 가져오기
  useEffect(() => {
    const fetchSelfLetters = () => {
      try {
        setLoading(true);
        
        const currentUser = getCurrentUser();
        const currentUserId = getCurrentUserId();
        const mailboxData = loadMailbox();
        
        console.log('나에게 보낸 편지 조회 - 현재 사용자:', currentUser);
        
        // 나에게 보낸 편지: sender와 receiver가 모두 현재 사용자인 편지들
        const selfLetters = Object.values(mailboxData.letters || {}).filter(letter => {
          try {
            const letterSenderId = parseInt(letter.senderId) || letter.senderId;
            const letterReceiverId = parseInt(letter.receiverId) || letter.receiverId;
            const userIdNum = parseInt(currentUserId) || currentUserId;
            
            return (letterSenderId === userIdNum && letterReceiverId === userIdNum);
          } catch (err) {
            console.error('편지 필터링 오류:', err, letter);
            return false;
          }
        });
        
        console.log('나에게 보낸 편지 목록:', selfLetters);
        
        // localStorage 데이터를 UI에 맞게 변환
        const transformedData = selfLetters.map(letter => ({
          id: letter.id,
          title: letter.title || letter.content?.slice(0, 20) || "제목 없음",
          content: letter.content,
          isLocked: letter.locked || (letter.openAt && new Date(letter.openAt) > new Date()),
          openDate: letter.openAt ? new Date(letter.openAt).toLocaleDateString('ko-KR').replace(/\./g, '. ').replace(/ $/, '') : "",
          daysLeft: letter.openAt ? Math.max(0, Math.ceil((new Date(letter.openAt) - new Date()) / (1000 * 60 * 60 * 24))) : 0,
          font: letter.fontStyle?.toLowerCase() || "basic",
          paper: letter.paperTheme?.toLowerCase() || "white",
          createdAt: letter.sentAt || letter.createdAt,
          thumbnail: letter.thumbnail,
          image1: letter.image1
        }));
        
        // 정렬 적용
        const sortedData = transformedData.sort((a, b) => {
          if (sort === "latest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
        });
        
        setSelfLetters(sortedData);
        setError(null);
        
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
          <h1 className="stm-title">{getCurrentUserNickname()}에게 보낸 편지</h1>
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
