import { useState } from "react";
import "../styles/fonts.css";
import "./FontSelector.css"; // 버튼 스타일용 (선택사항)

const FontSelector = () => {
  const [font, setFont] = useState("Cafe24Surround"); // 기본 폰트

  return (
    <div>
      <div className="font_wrap">
        <button onClick={() => setFont("Cafe24Surround")} className="font-btn">둥근체</button>
        <button onClick={() => setFont("OngleipParkDahyeon")} className="font-btn">부드러운체</button>
        <button onClick={() => setFont("JoseonGulim")} className="font-btn">우아한체</button>
        <button onClick={() => setFont("Suit")} className="font-btn">모던체</button>
        <button onClick={() => setFont("GowoonDodum")} className="font-btn">따뜻한체</button>
      </div>

      <div className="font-preview" style={{ fontFamily: font }}>
        안녕하세요 💌<br />
        현재 선택된 폰트는 <b>{font}</b> 입니다.
      </div>
    </div>
  );
};

export default FontSelector;
