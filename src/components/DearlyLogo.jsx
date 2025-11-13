// src/components/DearlyLogo.jsx
import './DearlyLogo.css';

// 위에서 말한 SVG 파일 경로
import blueEnv from '../assets/logos/envelope-blue.svg';
import yellowEnv from '../assets/logos/envelope-yellow.svg';
import navyEnv from '../assets/logos/envelope-navy.svg';

export default function DearlyLogo({ variant = 'default' }) {
  return (
    <div className="dearly-logo-wrapper">
      {/* 떠다니는 파란 봉투 */}
      <div className="logo-envelope logo-envelope-blue">
        <img src={blueEnv} alt="" />
      </div>

      {/* 떠다니는 노란 봉투 */}
      <div className="logo-envelope logo-envelope-yellow">
        <img src={yellowEnv} alt="" />
      </div>

      {/* 떠다니는 남색 봉투 */}
      <div className="logo-envelope logo-envelope-navy">
        <img src={navyEnv} alt="" />
      </div>

      {/* Dearly 텍스트 */}
      <div
        className={
          variant === 'light'
            ? 'dearly-logo-text dearly-logo-text-light'
            : 'dearly-logo-text'
        }
      >
        Dearly
      </div>
    </div>
  );
}
