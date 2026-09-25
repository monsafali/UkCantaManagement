import { create } from "zustand";
import axiosInstance from "../api/axios";

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  // =========================
  // GET ME
  // =========================
  getMe: async () => {
    try {
      set({ loading: true });

      const response = await axiosInstance.get("/auth/Getme");

      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
      });

      return response.data.user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      return null;
    }
  },

  // =========================
  // LOGIN
  // =========================
  login: async ({ username, password, role }) => {
    try {
      set({ loading: true });

      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
        role,
      });

      /*
        Backend sends JWT cookie.
        We don't save token in localStorage.
      */

      const user = response.data.user;

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return {
        success: true,
        user,
      };
    } catch (error) {
      set({
        loading: false,
        user: null,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  // =========================
  // CLEAR AUTH
  // =========================
  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  },
}));

export default useAuthStore;
