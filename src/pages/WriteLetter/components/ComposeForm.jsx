import { useState } from "react";
import { Upload } from "lucide-react";
import "../styles/form.css";

const FONTS = [
  { key: "basic",   label: "기본",   sample: "안녕하세요 :)" },
  { key: "dunggeun",label: "둥근",   sample: "안녕하세요 :)" },
  { key: "soft",    label: "부드러운", sample: "안녕하세요 :)" },
  { key: "elegant", label: "우아한", sample: "안녕하세요 :)" },
  { key: "modern",  label: "모던",   sample: "안녕하세요 :)" },
  { key: "warm",    label: "따뜻한", sample: "안녕하세요 :)" },
];
const PAPERS = ["white", "lavender", "pink-heart", "sky", "clover", "peach"];

export default function ComposeForm() {
  const [fontKey, setFontKey] = useState("basic");
  const [paper, setPaper]    = useState("white");
  const [text, setText]      = useState("");
  const [files, setFiles]    = useState([]);

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...list]);
  };
  const removeAt = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  return (
    <form className="wl-form" onSubmit={(e)=>e.preventDefault()}>
      {/* 글씨체 */}
      <label className="wl-label">글씨체 선택</label>
      <div className="wl-font-grid">
        {FONTS.map((f) => (
          <button
            type="button"
            key={f.key}
            className={`wl-font-card ${fontKey === f.key ? "is-active" : ""}`}
            onClick={() => setFontKey(f.key)}
            style={{ fontFamily: `var(--font-${f.key})` }}
          >
            <div className="wl-font-title">{f.label}</div>
            <div className="wl-font-sample">{f.sample}</div>
          </button>
        ))}
      </div>

      {/* 편지지 */}
      <label className="wl-label" style={{ marginTop: 16 }}>편지지 선택</label>
      <div className="wl-paper-grid">
        {PAPERS.map((p) => (
          <button
            type="button"
            key={p}
            className={`wl-paper-chip ${paper === p ? "is-active" : ""}`}
            onClick={() => setPaper(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 본문 */}
      <label className="wl-label with-note" style={{ marginTop: 16 }}>
        본문 <span className="note">받는 사람만 볼 수 있어요</span>
      </label>
      <div className={`wl-paper paper-${paper}`} style={{ fontFamily: `var(--font-${fontKey})` }}>
        <textarea
          className="wl-textarea"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="내용을 입력하세요…"
        />
      </div>

      {/* 업로더 */}
      <label className="wl-label" style={{ marginTop: 16 }}>첨부</label>
      <label className="wl-uploader">
        <input type="file" accept="image/*" multiple onChange={onPickFiles} />
        <div className="uploader-inner">
          <Upload className="uploader-icon" />
          이미지 추가
        </div>
      </label>

      {files.length > 0 && (
        <div className="wl-previews" aria-label="첨부 미리보기">
          {files.map((f, i) => (
            <div className="wl-preview" key={`${f.name}-${i}`}>
              <img src={URL.createObjectURL(f)} alt="" />
              <button className="wl-remove" type="button" onClick={() => removeAt(i)}>×</button>
            </div>
          ))}
        </div>
      )}

      <button className="wl-submit" type="submit">저장하기</button>
    </form>
  );
}
