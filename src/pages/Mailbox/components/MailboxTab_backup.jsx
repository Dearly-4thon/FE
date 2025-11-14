// src/pages/Mailbox/components/MailboxTab.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Mail, Lock, Clock, X } from "lucide-react";
import { jsPDF } from "jspdf";
import { getInbox, getSent } from "../../../api/mailbox";
import { getCurrentUser, getCurrentUserNickname } from "../../../utils/userInfo";
import "../styles/mailbox-tab.css";

const LS_KEY = "dearly-mailbox";

const loadMailbox = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

// 제목 9자 + … 처리
const shortenTitle = (title = "") => {
  if (title.length <= 9) return title;
  return title.slice(0, 9) + "…";
};

const downloadLetterPdf = (item) => {
  if (!item) return;

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const title = item.title || "디어리의 편지";
  const date = item.sentAt || item.openAt || "";
  const sender = item.sender || "디어리";
  const bodyRaw = item.body || item.content || "";
  const body = bodyRaw.replace(/\r\n/g, "\n");

  // 제목
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(18);
  doc.text(title, 40, 60);

  // 날짜 / 보낸 사람
  doc.setFontSize(11);
  if (date) doc.text(date, 40, 80);
  doc.text(`From. ${sender}`, 40, 100);

  // 본문
  doc.setFontSize(13);
  const lines = doc.splitTextToSize(body, 515); // A4 폭 기준 적당히 줄바꿈
  doc.text(lines, 40, 130);

  // 파일 내려받기
  const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_");
  doc.save(`${safeTitle || "letter"}.pdf`);
};


export default function MailboxTabs() {
  // API 데이터 상태
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("inbox"); // 'inbox' | 'sent'
  const [selected, setSelected] = useState(null); // 모달용

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchMailboxData = async () => {
      try {
        setLoading(true);
        
        // 현재 사용자 정보 가져오기
        const currentUser = getCurrentUser();
        const currentUserNickname = getCurrentUserNickname();
        
        // localStorage에서 실제 편지 데이터 가져오기
        const mailboxData = loadMailbox();
        const currentUserId = currentUser?.id;
        
        console.log('현재 사용자:', currentUser);
        console.log('메일박스 데이터:', mailboxData);
        
        // 받은편지: 현재 사용자가 receiver인 편지들
        const inboxLetters = Object.values(mailboxData.letters || {}).filter(letter => 
          letter.receiverId === currentUserId || letter.receiverId === parseInt(currentUserId)
        );

        // 보낸편지: 현재 사용자가 sender인 편지들
        const sentLetters = Object.values(mailboxData.letters || {}).filter(letter => 
          letter.senderId === currentUserId || letter.senderId === parseInt(currentUserId)
        );
        
        console.log('받은편지:', inboxLetters);
        console.log('보낸편지:', sentLetters);
        
        setInbox(inboxLetters);
        setSent(sentLetters);
        
      } catch (err) {
        console.error("메일박스 데이터 로드 에러:", err);
        setInbox([]);
        setSent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMailboxData();
    
    // localStorage 변경 감지 (편지 봉인 시 자동 새로고침)
    const handleStorageChange = () => {
      fetchMailboxData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 컴포넌트 내부에서 localStorage 변경 감지를 위한 커스텀 이벤트
    const handleCustomStorageChange = () => {
      fetchMailboxData();
    };
    
    window.addEventListener('mailboxUpdate', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mailboxUpdate', handleCustomStorageChange);
    };
  }, []);

  const list = tab === "inbox" ? inbox : sent;
  const isEmpty = list.length === 0;

  const closeModal = () => setSelected(null);

  return (
    <>
      <section className="mbx-tabs">
        {/* 🔵 위쪽 탭 레이아웃 (분리 유지) */}
        <div className="mbx-switch">
          <button
            type="button"
            className={`mbx-switch-btn ${tab === "inbox" ? "is-active" : ""}`}
            onClick={() => setTab("inbox")}
          >
            받은 편지 ({inbox.length})
          </button>
          <button
            type="button"
            className={`mbx-switch-btn ${tab === "sent" ? "is-active" : ""}`}
            onClick={() => setTab("sent")}
          >
            보낸 편지 ({sent.length})
          </button>
        </div>

        {/* 🟡 아래 내용 레이아웃 (패널 안에서만 변경) */}
        <div className="mbx-panel">
          {isEmpty ? (
            <div className="mbx-empty-panel">
              <div className="mbx-empty-icon-wrap">
                <Mail className="mbx-empty-icon" size={32} />
              </div>
              <p className="mbx-empty-main">
                아직 {tab === "inbox" ? "받은 편지가" : "보낸 편지가"} 없어요.
              </p>
              <p className="mbx-empty-sub">편지를 작성해보세요!</p>
            </div>
          ) : (
            <div className="mbx-mail-list-wrap">
              <ul className="mbx-mail-list">
                {list.map((item) => {
                  const isLocked = item.locked || (item.openAt && new Date(item.openAt) > new Date());
                  const sender = item.sender || getCurrentUserNickname();
                  const hasImage = item.image1 || item.thumbnail;
                  
                  // D-day 계산
                  let dday = 0;
                  if (isLocked && item.openAt) {
                    const openDate = new Date(item.openAt);
                    const today = new Date();
                    const diffTime = openDate - today;
                    dday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <li
                      key={item.id}
                      className="mbx-letter-item"
                      onClick={() => setSelected(item)}
                    >
                      <div className="mbx-letter-left">
                        {isLocked ? (
                          <>
                            <div className="mbx-letter-dday">D-{dday}</div>
                            <div className="mbx-letter-lock">
                              <Lock size={24} />
                            </div>
                            <div className="mbx-letter-open-info">
                              {item.openAt ? new Date(item.openAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'numeric', 
                                day: 'numeric'
                              }).replace(/\./g, '. ').replace(/ $/, '') : ''}에 공개
                            </div>
                          </>
                        ) : (
                          <div className="mbx-letter-preview">
                            <div className="mbx-letter-title">
                              {item.title || '제목 없음'}
                            </div>
                            <div className="mbx-letter-sender">
                              {sender}
                            </div>
                            <div className="mbx-letter-content">
                              {item.content && item.content.length > 30 
                                ? item.content.substring(0, 30) + '...'
                                : item.content}
                            </div>
                            <div className="mbx-letter-date">
                              {item.sentAt || item.openAt}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mbx-letter-right">
                        {hasImage ? (
                          <div 
                            className="mbx-letter-image"
                            style={{
                              backgroundImage: `url(${item.image1 || item.thumbnail})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />
                        ) : (
                          <div className={`mbx-letter-paper ${item.paperTheme || item.paper_theme || 'white'}`}>
                            <Mail size={20} />
                          </div>
                        )}
                      </div>
                        {isLocked ? (
                          <>
                            {/* 상단 D-day 뱃지 (좌) + 메일 아이콘(우, 옵션) */}
                            <div className="mbx-mail-card-top">
                              <span className="mbx-mail-badge">
                                <Clock size={10} className="mbx-badge-icon" />
                                D-{item.dday}
                              </span>
                            </div>

                            {/* 가운데 자물쇠 */}
                            <div className="mbx-mail-locked-center">
                              <Lock className="mbx-mail-lock-icon" size={32} />
                            </div>

                            {/* 하단 공개 날짜 */}
                            <div className="mbx-mail-open-date">
                              {item.openAt}에 공개
                            </div>
                          </>
                        ) : (
                          <>
                            {/* 제목 (최대 9자 + …) */}
                            <div className="mbx-mail-open-title-wrap">
                              <div className="mbx-mail-open-title">
                                {shortenTitle(item.title)}
                              </div>
                            </div>
                            {/* 구분선 */}
                            <div className="mbx-mail-open-divider" />
                            {/* 작성자 */}
                            <div className="mbx-mail-open-sender">{sender}</div>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          모달 (열린 편지 / 비밀 편지)
      ========================== */}
      {selected && (
        <div className="mbx-modal-backdrop" onClick={closeModal}>
          <div
            className="mbx-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mbx-modal-header">
              <h2 className="mbx-modal-title">디어리의 편지</h2>
              <button
                type="button"
                className="mbx-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </header>

            {selected.locked ? (
              /* 🔒 아직 디데이 안 지난 편지 */
              <div className="mbx-modal-locked">
                <div className="mbx-modal-lock-icon-wrap">
                  <Lock className="mbx-modal-lock-icon" size={40} />
                </div>
                <p className="mbx-modal-locked-main">아직은 비밀이에요.</p>
                <p className="mbx-modal-locked-sub">
                  {selected.openAt}에 함께 열어봐요.
                </p>
              </div>
            ) : (
              /* 🔓 디데이 지난 편지 (내용 전체) */
              <div className="mbx-modal-open">
                <div className="mbx-modal-letter-box">
                  <div className="mbx-modal-letter-header">
                    <div className="mbx-modal-letter-to">
                      {selected.sender || "디어리"}
                    </div>
                    <div className="mbx-modal-letter-date">
                      {selected.sentAt || selected.openAt}
                    </div>
                  </div>
                  <div className="mbx-modal-letter-divider" />
                  <div className="mbx-modal-letter-body">
                    {selected.body || selected.content}
                  </div>
                </div>

                <button
                  type="button"
                  className="mbx-modal-pdf-btn"
                  onClick={() => downloadLetterPdf(selected)}   // ⬅️ 실제 저장 호출
                >
                  <span className="mbx-modal-pdf-icon">⬇️</span>
                  편지를 PDF로 저장
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
