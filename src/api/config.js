// src/api/config.js
export const API_BASE_URL = 'https://zihyuniz.shop';

// CORS 설정을 위한 기본 헤더
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout', 
    refresh: '/auth/refresh',
    kakao: '/auth/kakao'
  },
  letters: {
    create: '/letters',
    list: '/letters',
    detail: '/letters/{id}'
  },
  mailbox: {
    inbox: '/mailbox/received',
    sent: '/mailbox/sent' 
  }
};

// 레거시 지원
export const BASE_URL = API_BASE_URL;
export const API_PREFIX = "/api";
export const API_BASE = `${BASE_URL}${API_PREFIX}`;