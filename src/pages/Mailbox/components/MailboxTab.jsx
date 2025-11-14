// src/pages/Mailbox/components/MailboxTabs.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Lock, Clock, X } from "lucide-react";
import { jsPDF } from "jspdf";              // ⬅️ 추가
import { getInbox, getSent, getSelfLetters } from "../../../api/mailbox";
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
  const location = useLocation();
  
  // API 데이터 상태
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0); // 데이터 새로고침용

  const [tab, setTab] = useState("inbox"); // 'inbox' | 'sent'
  const [selected, setSelected] = useState(null); // 모달용

  // API에서 데이터 가져오기 (페이지 이동 시 새로고침 포함)
  useEffect(() => {
    const fetchMailboxData = async () => {
      try {
        console.log("🔄 MailboxTab: 데이터 새로고침 시작");
        setLoading(true);
        
        // 실제 API 호출로 데이터 가져오기
        const [inboxResponse, sentResponse, selfResponse] = await Promise.all([
          getInbox().catch(err => {
            console.error("받은편지 API 에러:", err);
            return { data: [] };
          }),
          getSent().catch(err => {
            console.error("보낸편지 API 에러:", err);
            return { data: [] };
          }),
          getSelfLetters().catch(err => {
            console.error("나에게 보낸편지 API 에러:", err);
            return { data: [] };
          })
        ]);
        
        // 보낸편지에 나에게 보낸 편지도 합치기
        const sentData = sentResponse.data || [];
        const selfData = (selfResponse.data || []).map(letter => ({
          ...letter,
          isSelfLetter: true // 나에게 보낸 편지 구분용 플래그
        }));
        
        setInbox(inboxResponse.data || []);
        setSent([...sentData, ...selfData]); // 보낸편지 + 나에게 보낸편지
        
      } catch (err) {
        console.error("메일박스 데이터 로드 에러:", err);
        setInbox([]);
        setSent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMailboxData();
  }, [location.pathname, dataVersion]); // 페이지 이동 시와 데이터 변경 시 새로고침
  
  // 편지 전송 후 focus 처리
  useEffect(() => {
    if (location.state?.focus === "sent") {
      console.log("📨 MailboxTab: 보낸편지 탭으로 이동");
      setTab("sent");
      // 데이터 강제 새로고침
      setDataVersion(prev => prev + 1);
    }
  }, [location.state]);

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
              <p className="mbx-empty-sub">친구들과 편지방을 만들어보세요!</p>
            </div>
          ) : (
            /* ✅ 여기서부터 카드 그리드 */
            <div className="mbx-mail-grid-wrap">
              <ul className="mbx-mail-grid">
                {list.map((item) => {
                  const isLocked = item.locked;
                  const sender = item.sender || "디어리 올림";

                  return (
                    <li
                      key={item.id}
                      className={`mbx-mail-card ${item.isSelfLetter ? 'self-letter' : ''}`}
                      onClick={() => setSelected(item)}
                    >
                      <div
                        className={`mbx-mail-card-inner ${isLocked ? "is-locked" : "is-open"
                          }`}
                      >
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
                            {/* 작성자 (나에게 보낸 편지는 "나에게" 표시) */}
                            <div className="mbx-mail-open-sender">
                              {item.isSelfLetter ? "나에게" : sender}
                            </div>
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
