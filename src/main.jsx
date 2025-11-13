// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import "./styles/fonts.css";

// ✅ 기존에 설치돼 있던 PWA 서비스워커/캐시를 개발 모드에서 정리
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister())
  }).catch(() => {})
  caches?.keys?.().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {})
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
