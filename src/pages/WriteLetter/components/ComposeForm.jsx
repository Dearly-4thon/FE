// src/pages/WriteLetter/components/ComposeForm.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import "../styles/form.css"; // ✅ 경로 확인
import "../styles/base.css";  

const FONTS = [
  { key: "basic", label: "기본체", sample: "안녕하세요 ♡" },
  { key: "dunggeun", label: "둥근체", sample: "안녕하세요 ♡" },
  { key: "soft", label: "부드러운체", sample: "안녕하세요 ♡" },
  { key: "elegant", label: "우아한체", sample: "안녕하세요 ♡" },
  { key: "modern", label: "모던체", sample: "안녕하세요 ♡" },
  { key: "warm", label: "따뜻한체", sample: "안녕하세요 ♡" },
];
const PAPERS = ["white", "lavender", "pink-heart", "sky", "clover", "peach"];

export default function ComposeForm() {
  const nav = useNavigate();
  const { handle } = useParams();
  const { state } = useLocation();
  const friendName = state?.friendName ?? "";

  const meta = useMemo(() => {
    if (handle) {
      const name = friendName || handle;
      return {
        title: `${name}에게 쓰는 편지`,
        subtitle: `${name}님에게 전하는 메시지`,
        showBack: true,
      };
    }
    return {
      title: "나에게 쓰는 편지",
      subtitle: "미래의 나에게 남기는 메시지",
      showBack: true,
    };
  }, [handle, friendName]);

  const [fontKey, setFontKey] = useState("basic");
  const [paper, setPaper] = useState("white");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list]);
  };
  const removeAt = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="wl-screen plain">
      <header className="compose-header">
        {meta.showBack && (
          <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로가기">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="compose-title">{meta.title}</h1>
        <p className="compose-subtitle">{meta.subtitle}</p>
      </header>

      <form className="wl-form" onSubmit={(e) => e.preventDefault()}>
        <label className="wl-label">폰트 선택</label>
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

        <label className="wl-label with-note" style={{ marginTop: 16 }}>
          편지 내용 <span className="note">받는 사람만 볼 수 있어요</span>
        </label>
        <div className={`wl-paper paper-${paper}`} style={{ fontFamily: `var(--font-${fontKey})` }}>
          <textarea
            className="wl-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={handle ? `${friendName || handle}님에게 전하고 싶은 말을 적어보세요…` : "미래의 나에게 전하고 싶은 말을 적어보세요…"}
          />
        </div>

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
    </div>
  );
}
