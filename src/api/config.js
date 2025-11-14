export const API_BASE_URL = 'https://zihyuniz.shop';

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

// src/api/config.js
export const BASE_URL = "https://zihyuniz.shop";
export const API_PREFIX = ""; // 지금은 /api 없음
export const API_BASE = `${BASE_URL}${API_PREFIX}`;