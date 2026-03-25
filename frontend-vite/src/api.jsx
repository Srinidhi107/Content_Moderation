import axios from "axios";

const fallbackBaseUrl = "https://content-moderation-b943.onrender.com";

const rawBaseUrl = import.meta.env.VITE_API_URL || fallbackBaseUrl;
const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const API = {
  login: "/api/auth/login",
  signup: "/api/auth/signup",
  getPosts: "/api/posts",
  createPost: "/api/posts",
  deletePost: (id) => `/api/posts/${id}`,
  updatePost: (id) => `/api/posts/${id}`,
  likePost: (id) => `/api/posts/${id}/like`,
  addComment: "/api/comments",
};