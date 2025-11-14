import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./LetterRoomCreate.css";

import { createLetterRoom } from "../../api/LetterRoom.js";
import { toast } from "../../lib/toast.js";

import backIcon from "../../assets/icons/arrowBack.svg";
import addImageIcon from "../../assets/icons/addImage.svg";
import calendarIcon from "../../assets/icons/calendar.svg";

export default function LetterRoomCreate() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);

  // 프론트 선택 값 (라디오 value)
  const [visibility, setVisibility] = useState("PUBLIC");
  const [writePermission, setWritePermission] = useState("ALL");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [coverImage, setCoverImage] = useState(null);

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(file);
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date) {
      toast("제목과 날짜는 필수 입력 항목입니다.", "error");
      return;
    }

    const formData = new FormData();
    const ownerId = Number(localStorage.getItem("user_id"));
    
    // 사용자 ID 검증
    if (!ownerId || isNaN(ownerId)) {
      toast("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.", "error");
      navigate("/login");
      return;
    } 

    formData.append("title", title);
    formData.append("open_at", date.toISOString().split("T")[0]);
    formData.append("owner", ownerId);

    // visibility 매핑
    const visibilityValue =
      visibility === "FRIEND" ? "PUBLIC_FRIENDS" : "PUBLIC_ALL";
    formData.append("visibility", visibilityValue);

    // write_permission 매핑
    let wp = "WRITE_ALL";
    if (writePermission === "FRIEND") wp = "WRITE_FRIENDS";
    if (writePermission === "INVITE") wp = "WRITE_INVITED";
    formData.append("write_permission", wp);

    // boolean
    formData.append("allow_anonymous", isAnonymous ? "true" : "false");

    if (coverImage) formData.append("cover_image", coverImage);

    /* ---------------------------
        🚀 formData 내용 콘솔 출력
       --------------------------- */
    console.log("📌 [DEBUG] formData 요청 내용 ------------------");
    for (const pair of formData.entries()) {
      console.log(pair[0], ":", pair[1]);
    }
    console.log("--------------------------------------------------");

    try {
      console.log("📤 편지방 생성 요청 시작...");
      const result = await createLetterRoom(formData);
      console.log("✅ 편지방 생성 성공:", result);
      
      toast("편지방이 성공적으로 생성되었습니다!", "success");
      setTimeout(() => navigate("/letters"), 1000);
    } catch (error) {
      console.error("❌ 편지방 생성 실패:", error);

      if (error.response) {
        console.log("🔍 서버 응답:", error.response.data);
        console.log("🔍 상태 코드:", error.response.status);
        console.log("🔍 전체 response:", error.response);
        
        const errorMsg = error.response.data?.detail || 
                        error.response.data?.message || 
                        `서버 오류 (${error.response.status})`;
        toast(errorMsg, "error");
      } else if (error.request) {
        console.log("🔍 요청 정보:", error.request);
        toast("서버와의 연결에 문제가 발생했습니다.", "error");
      } else {
        console.log("🔍 에러 메시지:", error.message);
        toast("편지방 생성 중 오류가 발생했습니다.", "error");
      }
    }
  };


  return (
    <div className="create-container">
      <header className="create-header">
        <button className="back-btn" onClick={handleBack}>
          <img src={backIcon} alt="뒤로가기" />
        </button>
        <h2 className="header-title">편지방 만들기</h2>
      </header>

      <form className="create-form" onSubmit={handleSubmit}>
        <label className="input-label">편지방 제목*</label>
        <input
          type="text"
          placeholder="예: 친구야 생일 축하해 🎂"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-box"
          required
        />

        <label className="input-label">커버 이미지 (선택)</label>
        <label className="cover-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <img src={addImageIcon} alt="이미지 추가" />
          <span>{coverImage ? coverImage.name : "앨범에서 선택하기"}</span>
        </label>

        <label className="input-label">디데이 (공개 날짜)*</label>
        <div className="date-selector">
          <img src={calendarIcon} alt="달력" className="calendar-icon" />
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy.MM.dd"
            placeholderText="날짜 선택"
            className="date-input"
            popperPlacement="bottom-start"
          />
        </div>

        <label className="input-label">공개 범위</label>
        <div className="radio-group">
          <label
            className={`radio-option ${
              visibility === "PUBLIC" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              checked={visibility === "PUBLIC"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <span>전체 공개</span>
            <p>모든 사람이 볼 수 있어요</p>
          </label>

          <label
            className={`radio-option ${
              visibility === "FRIEND" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="visibility"
              value="FRIEND"
              checked={visibility === "FRIEND"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <span>친구 공개</span>
            <p>친구만 볼 수 있어요</p>
          </label>
        </div>

        <label className="input-label">작성 권한</label>
        <div className="radio-group">
          {[
            { key: "ALL", label: "모두", desc: "누구나 편지를 쓸 수 있어요" },
            {
              key: "FRIEND",
              label: "친구만",
              desc: "친구만 편지를 쓸 수 있어요",
            },
            {
              key: "INVITE",
              label: "초대만",
              desc: "초대한 사람만 쓸 수 있어요",
            },
          ].map((item) => (
            <label
              key={item.key}
              className={`radio-option ${
                writePermission === item.key ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="writePermission"
                value={item.key}
                checked={writePermission === item.key}
                onChange={(e) => setWritePermission(e.target.value)}
              />
              <span>{item.label}</span>
              <p>{item.desc}</p>
            </label>
          ))}
        </div>

        <div className="switch-section">
          <span>익명 허용</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="btn-row">
          <button type="button" className="cancel-btn" onClick={handleBack}>
            취소
          </button>
          <button type="submit" className="submit-btn">
            편지방 만들기
          </button>
        </div>
      </form>
    </div>
  );
}
