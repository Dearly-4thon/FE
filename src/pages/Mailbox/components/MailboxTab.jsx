// src/pages/Mailbox/components/MailboxTab.jsx
import React, { useState, useEffect } from "react";
import { Mail, Lock, Clock, X } from "lucide-react";
import { jsPDF } from "jspdf";
import { getCurrentUser, getCurrentUserNickname, getCurrentUserId } from "../../../utils/userInfo";
import "../styles/mailbox-tab.css";

const LS_KEY = "dearly-mailbox";

const loadMailbox = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

const downloadLetterPdf = (item) => {
  if (!item) return;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const title = item.title || "편지";
  const date = item.sentAt || item.openAt || "";
  const sender = item.sender || getCurrentUserNickname();
  const bodyRaw = item.body || item.content || "";
  const body = bodyRaw.replace(/\r\n/g, "\n");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(18);
  doc.text(title, 40, 60);

  doc.setFontSize(11);
  if (date) doc.text(date, 40, 80);
  doc.text(`From. ${sender}`, 40, 100);

  doc.setFontSize(13);
  const lines = doc.splitTextToSize(body, 515);
  doc.text(lines, 40, 130);

  const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_");
  doc.save(`${safeTitle || "letter"}.pdf`);
};

export default function MailboxTab() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("inbox");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchMailboxData = () => {
      try {
        setLoading(true);
        
        // localStorage 전체 내용 디버깅
        console.log('=== localStorage 전체 내용 ===');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
          console.log(`${key}: ${value}`);
        }
        
        const mailboxData = loadMailbox();
        const currentUser = getCurrentUser();
        const currentUserId = getCurrentUserId();
        
        console.log('현재 사용자 정보:', currentUser);
        console.log('현재 사용자 ID:', currentUserId);
        console.log('메일박스 데이터:', mailboxData);
        
        // 편지 데이터 정규화 (배열 또는 객체 모두 처리)
        let lettersArray = [];
        if (mailboxData.letters) {
          if (Array.isArray(mailboxData.letters)) {
            lettersArray = mailboxData.letters;
          } else {
            lettersArray = Object.values(mailboxData.letters);
          }
        }
        
        console.log('정규화된 편지 배열:', lettersArray);
        
        // 받은편지: 현재 사용자가 receiver인 편지들
        const inboxLetters = lettersArray.filter(letter => {
          const currentUserIdNum = parseInt(currentUserId, 10);
          const letterReceiverIdNum = parseInt(letter.receiverId || letter.receiver_id, 10);
          
          const match = letterReceiverIdNum === currentUserIdNum;
          
          console.log(`📬 편지 ${letter.id} 받은편지 필터링:`, {
            letterReceiverId: letter.receiverId,
            letterReceiver_id: letter.receiver_id,
            letterReceiverIdNum: letterReceiverIdNum,
            currentUserId: currentUserId,
            currentUserIdNum: currentUserIdNum,
            match: match
          });
          return match;
        });
        
        // 보낸편지: 현재 사용자가 sender인 편지들
        const sentLetters = lettersArray.filter(letter => {
          const currentUserIdNum = parseInt(currentUserId, 10);
          const letterSenderIdNum = parseInt(letter.senderId || letter.sender_id, 10);
          
          const match = letterSenderIdNum === currentUserIdNum;
          
          console.log(`📧 편지 ${letter.id} 보낸편지 필터링:`, {
            letterSenderId: letter.senderId,
            letterSender_id: letter.sender_id,
            letterSenderIdNum: letterSenderIdNum,
            currentUserId: currentUserId,
            currentUserIdNum: currentUserIdNum,
            match: match
          });
          return match;
        });
        
        console.log('📬 받은편지 총', inboxLetters.length, '개:', inboxLetters);
        console.log('📧 보낸편지 총', sentLetters.length, '개:', sentLetters);
        console.log('💾 localStorage 전체 편지 수:', lettersArray.length);
        
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
    
    const handleStorageChange = () => {
      fetchMailboxData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mailboxUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mailboxUpdate', handleStorageChange);
    };
  }, []);

  const list = tab === "inbox" ? inbox : sent;
  const isEmpty = list.length === 0;
  const closeModal = () => setSelected(null);

  return (
    <>
      <section className="mbx-tabs">
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
                          <div className="mbx-letter-locked">
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
                          </div>
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
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 모달 */}
      {selected && (
        <div className="mbx-modal-backdrop" onClick={closeModal}>
          <div className="mbx-modal" onClick={(e) => e.stopPropagation()}>
            <header className="mbx-modal-header">
              <h2 className="mbx-modal-title">편지</h2>
              <button type="button" className="mbx-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </header>

            {selected.locked ? (
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
              <div className="mbx-modal-open">
                <div className="mbx-modal-letter-box">
                  <div className="mbx-modal-letter-header">
                    <div className="mbx-modal-letter-to">
                      {selected.sender || getCurrentUserNickname()}
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
                  onClick={() => downloadLetterPdf(selected)}
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