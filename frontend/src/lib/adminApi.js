'use client';

import axios from 'axios';

const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

authAxios.interceptors.request.use(
  (config) => {
    const persistAuth = localStorage.getItem("persist:auth");

    if (persistAuth) {
      try {
        const parsed = JSON.parse(persistAuth);
        const tokenString = parsed.token;
        const token = JSON.parse(tokenString);

        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to attach token:", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      document.cookie = "jwt=; Max-Age=0; path=/";
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

export default authAxios;
