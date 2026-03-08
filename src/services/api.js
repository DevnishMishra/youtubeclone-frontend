import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
});

// Add JWT token automatically to headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
