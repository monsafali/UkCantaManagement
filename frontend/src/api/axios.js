import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API && import.meta.env.PROD) {
  throw new Error("VITE_API_URL must point to the deployed backend API");
}

const axiosInstance = axios.create({
  baseURL: API || "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default axiosInstance;
