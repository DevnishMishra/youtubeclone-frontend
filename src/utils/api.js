import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ── Videos ───────────────────────────────────────────────────────────
export const getAllVideos = () => API.get("/videos");
export const getVideoById = (id) => API.get(`/videos/${id}`);
export const searchVideos = (query) => API.get(`/videos/search/${query}`);
export const getVideosByCategory = (cat) => API.get(`/videos/category/${cat}`);
export const createVideo = (data) => API.post("/videos", data);
export const updateVideo = (id, data) => API.put(`/videos/${id}`, data);
export const deleteVideo = (id) => API.delete(`/videos/${id}`);
export const likeVideo = (id) => API.put(`/videos/${id}/like`);
export const dislikeVideo = (id) => API.put(`/videos/${id}/dislike`);

// ── Channels ─────────────────────────────────────────────────────────
export const getMyChannel = () => API.get("/channels/mine");
export const getChannelById = (id) => API.get(`/channels/${id}`);
export const createChannel = (data) => API.post("/channels", data);
export const updateChannel = (id, data) => API.put(`/channels/${id}`, data);
export const deleteChannel = (id) => API.delete(`/channels/${id}`);

// ── Comments ─────────────────────────────────────────────────────────
export const getCommentsByVideo = (videoId) => API.get(`/comments/${videoId}`);
export const addComment = (data) => API.post("/comments", data);
export const updateComment = (id, data) => API.put(`/comments/${id}`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

export default API;
