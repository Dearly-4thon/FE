// src/pages/LetterRoom/LetterRoomWrite.jsx
import React, { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../lib/toast";

import { FONTS, FONT_FAMILIES, PAPERS } from "../WriteLetter/js/font";
import SealButton from "../WriteLetter/components/SealButton";
import { createLetterInRoom } from "../../api/LetterRoom";

import "../WriteLetter/styles/compose.css";

export default function LetterRoomWrite() {
  const navigate = useNavigate();
  const { id } = useParams(); // 현재 편지방 ID

  const [fontKey, setFontKey] = useState("basic");
  const [paper, setPaper] = useState("white");
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const currentFontCss = useMemo(
    () => FONTS.find((f) => f.key === fontKey)?.css ?? "font-basic",
    [fontKey]
  );
  const currentFontFamily = FONT_FAMILIES[fontKey];

  // 이미지 업로드 처리
  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    const remain = Math.max(0, 3 - files.length);
    const next = list.slice(0, remain);

    if (list.length > remain) {
      toast("이미지는 최대 3장까지 가능합니다.", "error");
    }
    setFiles((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removeAt = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  // ==============================
  //    편지 전송 로직
  // ==============================
  const onSeal = async () => {
    if (!text.trim()) {
      toast("편지를 입력해주세요.", "error");
      return;
    }

    const body = {
      content: text,
      font_style: fontKey.toUpperCase(),
      paper_theme: paper.toUpperCase(),
      is_anonymous: isAnonymous,
      image: files[0] || null,
    };

    try {
      await createLetterInRoom(id, body);
      toast("편지가 작성되었습니다!", "success");
      navigate(`/letterroom/open/${id}`, { replace: true });
    } catch (err) {
      console.error(err);
      toast("편지 작성 중 오류가 발생했습니다.", "error");
    }
  };


  return (
    <div className="compose-screen plain">
      {/* 헤더 */}
      <header className="wl-compose-header">
        <div className="wl-header-row">
          <button
            className="wl-back-btn"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            ←
          </button>

          <div className="wl-title-group">
            <h2 className="wl-header-title">편지 작성</h2>
            <p className="wl-header-sub">이 편지방에 새로운 편지 남기기</p>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <div className="compose-stage">
        <div className="compose-scroll">
          {/* 익명 옵션 */}
          <div className="block">
            <div className="block-title">작성자 표시</div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <span>익명으로 작성하기</span>
            </label>
          </div>

          {/* 폰트 선택 */}
          <div className="block">
            <div className="block-title">폰트 선택</div>
            <div className="grid grid-2">
              {FONTS.map((f) => (
                <button
                  key={f.key}
                  className={`option hoverable ${fontKey === f.key ? "active" : ""}`}
                  onClick={() => setFontKey(f.key)}
                >
                  <div className="option-caption">{f.label}</div>
                  <div className={`option-sample ${f.css}`}>{f.sample}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 편지지 선택 */}
          <div className="block">
            <div className="block-title">편지지 선택</div>
            <div className="paper-chips-scroll">
              <div className="paper-chips-container">
                {PAPERS.map((p) => (
                  <button
                    key={p.key}
                    className={`chip hoverable ${p.chip} ${paper === p.key ? "active" : ""}`}
                    onClick={() => setPaper(p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="block">
            <div className="block-title">편지 내용</div>
            <div className="editor-container">
              <div
                className={`editor hoverable paper-${paper} ${currentFontCss}`}
                style={{ fontFamily: currentFontFamily }}
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="이 편지방에 남길 메시지를 적어보세요…"
                />
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="block">
            <div className="block-title">이미지 추가 (선택)</div>
            <p className="image-sub">첫 번째 사진이 대표 이미지로 사용돼요</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onPickFiles}
              hidden
            />

            <div className="image-upload-container">
              {files.length > 0 && (
                <div className="thumbs">
                  {files.map((f, i) => (
                    <div className="thumb" key={`${f.name}-${i}`}>
                      <img src={URL.createObjectURL(f)} alt="preview" />
                      <button className="thumb-x" onClick={() => removeAt(i)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length < 3 && (
                <button
                  className="upload-box hoverable"
                  onClick={() => fileInputRef.current?.click()}
                >
                  이미지 추가 ({files.length}/3)
                </button>
              )}
            </div>
          </div>

          <div className="bottom-spacer" />
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="footer-fixed">
        <div className="submit-button-area">
          <SealButton onClick={onSeal} disabled={!text.trim()} />
        </div>
      </div>
    </div>
  );
}
