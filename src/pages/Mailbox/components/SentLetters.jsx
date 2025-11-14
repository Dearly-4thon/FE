// src/pages/Mailbox/components/SentLetters.jsx
import React, { useState, useEffect } from "react";
import { getSent } from "../../../api/mailbox";
import "../../WriteLetter/styles/compose.css";
import "../../../styles/fonts.css";
import "../styles/sent.css";

const FONT_FAMILIES = {
  basic: '"Noto Sans KR", sans-serif',
  dunggeun: '"Cafe24Surround", sans-serif',
  soft: '"OngleipParkDahyeon", cursive',
  elegant: '"JoseonGulim", serif',
  modern: '"Suit", sans-serif',
  warm: '"GowoonDodum", sans-serif',
};
const FONT_CLASS = {
  basic: "font-basic",
  dunggeun: "font-rounded",
  soft: "font-soft",
  elegant: "font-elegant",
  modern: "font-modern",
  warm: "font-warm",
};

export default function SentLetters() {
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API에서 보낸편지 목록 가져오기
  useEffect(() => {
    const fetchSentLetters = async () => {
      try {
        setLoading(true);
        const response = await getSent();
        
        console.log("보낸편지 API 응답:", response.data);
        
        // API 응답 데이터를 UI에 맞게 변환
        const transformedData = (response.data || []).map(letter => ({
          id: letter.id,
          title: letter.content?.slice(0, 20) || "제목 없음",
          to: letter.receiver?.nickname || "알 수 없음",
          toLabel: letter.is_self_letter ? "나에게" : `${letter.receiver?.nickname || "알 수 없음"}에게`,
          font: letter.font_style?.toLowerCase() || "basic",
          openAt: letter.open_at ? new Date(letter.open_at).toLocaleDateString() : "",
          createdAt: letter.created_at,
          isOpen: letter.is_open
        }));
        
        setSent(transformedData);
        setError(null);
      } catch (err) {
        console.error("❌ 보낸편지 목록 API 에러:", err);
        
        // 임시 목업 데이터로 대체 (개발/테스트용)
        console.log("🔄 보낸편지 목업 데이터 사용 중...");
        const mockData = [
          {
            id: 1,
            title: "친구에게 보낸 편지",
            receiver: "김친구",
            receiverProfile: null,
            sentDate: "2024.12.13",
            font: "basic",
            paper: "beige",
            createdAt: "2024-12-13",
            content: "안녕! 오랜만이야~ 어떻게 지내?"
          },
          {
            id: 2,
            title: "가족에게 안부 편지",
            receiver: "엄마",
            receiverProfile: null,
            sentDate: "2024.12.12",
            font: "handwriting",
            paper: "pink",
            createdAt: "2024-12-12",
            content: "엄마 안녕하세요~ 저 잘 지내고 있어요!"
          }
        ];
        
        setSent(mockData);
        setError(null); // 에러 상태 해제
      } finally {
        setLoading(false);
      }
    };

    fetchSentLetters();
  }, []);

  if (loading) {
    return <p className="empty">편지 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="empty error">{error}</p>;
  }

  if (!sent.length) {
    return <p className="empty">아직 보낸 편지가 없어요.</p>;
  }

  return (
    <ul className="sent-list">
      {sent.map((item) => {
        // 화면에 찍을 "To. ~" 문구
        const toLabel =
          item.toLabel ||
          (item.to === "나" ? "나에게" : `${item.to}에게`);

        return (
          <li key={item.id} className="sent-item">
            <div className="sent-row">
              <div className="sent-meta">
                <div className="sent-to">To. {toLabel}</div>

                <div
                  className={`sent-title ${
                    FONT_CLASS[item.font] || "font-basic"
                  }`}
                  style={{
                    fontFamily:
                      FONT_FAMILIES[item.font] || FONT_FAMILIES.basic,
                  }}
                  title={item.title}
                >
                  {item.title}
                </div>
              </div>

              <div className="sent-date">D-DAY {item.openAt}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
