// src/pages/Mypage/EditProfile.jsx
import { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import '../../components/mypage/EditProfile.css';

import userIcon from '../../assets/icons/user.svg';
import pencilIcon from '../../assets/icons/pencil.svg';
import { fetchMyProfile, updateMyProfile } from '../../api/users';

export default function EditProfile({ onNavigate, onBack }) {
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('userProfileImage');
  });

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState(''); // 아이디 표시용

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fileInputRef = useRef(null);

  // 처음 들어올 때 내 프로필 정보 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { ok, data } = await fetchMyProfile();

        if (오케이) {
          setDisplayName(data.nickname ?? '');
          setUsername(data.user_id ?? '');
        } else {
          console.error('프로필 조회 실패', data);
        }
      } catch (err) {
        console.error('프로필 조회 중 에러', err);
      }
    };

    loadProfile();
  }, []);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 해요');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // 프로필 사진은 아직 로컬스토리지에만 저장 (백엔드 연동 X)
    if (profileImage) {
      localStorage.setItem('userProfileImage', profileImage);
    }

    try {
      const { ok, data } = await updateMyProfile({
        // ✅ 닉네임만 서버로 전송
        nickname: displayName,
      });

      if (!ok) {
        console.error('프로필 수정 실패', data);
        alert('프로필 저장에 실패했어요. 다시 시도해 주세요 😢');
        return;
      }

      // 비밀번호 변경은 /auth/password/change/ 연결 예정
      if (currentPassword || newPassword || confirmPassword) {
        alert('비밀번호 변경은 아직 API 연결 전이에요. (TODO)');
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error('프로필 수정 중 에러', err);
      alert('프로필 저장 중 문제가 생겼어요 😢');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      if (onBack) {
        onBack();
      } else if (onNavigate) {
        onNavigate('profile');
      }
    }, 100);
  };

  return (
    <div className="editpage-container">
      <Header onNavigate={onNavigate} />

      <div className="editpage-inner">
        {/* 상단 제목 + 뒤로가기 */}
        <div className="edit-top-row">
          <button
            type="button"
            className="edit-back-btn"
            onClick={onBack || (() => onNavigate && onNavigate('profile'))}
          >
            ←
          </button>
          <h1 className="edit-title">프로필 편집</h1>
        </div>

        {/* 프로필 사진 카드 */}
        <section className="edit-card">
          <p className="edit-section-label">프로필 사진</p>

          <div className="edit-avatar-block">
            <div className="edit-avatar-wrapper">
              <div className="edit-avatar-circle">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필"
                    className="edit-avatar-img"
                  />
                ) : (
                  <img src={userIcon} alt="기본 프로필" className="edit-avatar-icon" />
                )}
              </div>

              <button
                type="button"
                className="edit-avatar-edit-btn"
                onClick={handleProfileImageClick}
              >
                <img src={pencilIcon} alt="수정" className="edit-pencil-icon" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            <p className="edit-avatar-help">
              연필 버튼을 눌러 사진을 업로드하세요
            </p>
          </div>
        </section>

        {/* 닉네임 카드 */}
        <section className="edit-card">
          <div className="edit-field">
            <label htmlFor="displayName" className="edit-field-label">
              닉네임
            </label>
            <input
              id="displayName"
              className="edit-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
            <div className="edit-field-hint">
              {displayName.length}/20자
            </div>
          </div>
        </section>

        {/* 아이디 안내 박스 */}
        <section className="edit-info-box">
          아이디 <span className="edit-info-strong">@{username}</span>
          는 변경할 수 없어요
        </section>

        {/* 저장 버튼 */}
        <button
          type="button"
          className="edit-save-btn"
          disabled={!displayName.trim()}
          onClick={handleSave}
        >
          저장하기
        </button>
      </div>

      {/* 저장 완료 모달 */}
      {showSuccessModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3 className="edit-modal-title">프로필이 저장되었어요!</h3>
            <p className="edit-modal-text">
              변경사항이 성공적으로 적용되었습니다.
            </p>
            <button
              type="button"
              className="edit-modal-btn"
              onClick={handleModalClose}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
