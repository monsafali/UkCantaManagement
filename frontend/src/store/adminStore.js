import { create } from "zustand";
import axiosInstance from "../api/axios";

const useAdminStore = create((set, get) => ({
  dashboard: null,
  users: [],
  userPerformance: null,

  loading: false,
  usersLoading: false,
  performanceLoading: false,

  error: null,

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  getAdminDashboard: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await axiosInstance.get(
        "/admin/dashboard"
      );

      set({
        dashboard: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error.response?.data || error.message
      );

      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Failed to load admin dashboard",
      });

      throw error;
    }
  },

  // ==========================================
  // GET ALL USERS
  // ==========================================

  getAllUsers: async () => {
    try {
      set({
        usersLoading: true,
        error: null,
      });

      const response = await axiosInstance.get(
        "/admin/users"
      );

      set({
        users: response.data.users || [],
        usersLoading: false,
      });

      return response.data.users || [];
    } catch (error) {
      set({
        usersLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to load users",
      });

      throw error;
    }
  },

  // ==========================================
  // CREATE USER
  // ==========================================

  createUser: async (data) => {
    try {
      set({
        usersLoading: true,
        error: null,
      });

      const response = await axiosInstance.post(
        "/admin/users",
        data
      );

      set((state) => ({
        users: [
          response.data.user,
          ...state.users,
        ],
        usersLoading: false,
      }));

      // Refresh dashboard statistics
      await get().getAdminDashboard();

      return response.data;
    } catch (error) {
      set({
        usersLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to create user",
      });

      throw error;
    }
  },

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  toggleUserStatus: async (id) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/users/${id}/status`
      );

      set((state) => ({
        users: state.users.map((user) =>
          user._id === id
            ? {
                ...user,
                isActive: response.data.isActive,
              }
            : user
        ),
      }));

      await get().getAdminDashboard();

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to update user status",
      });

      throw error;
    }
  },

  // ==========================================
  // DELETE USER
  // ==========================================

  deleteUser: async (id) => {
    try {
      await axiosInstance.delete(
        `/admin/users/${id}`
      );

      set((state) => ({
        users: state.users.filter(
          (user) => user._id !== id
        ),
      }));

      await get().getAdminDashboard();
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to delete user",
      });

      throw error;
    }
  },

  // ==========================================
  // USER PERFORMANCE
  // ==========================================

  getUserPerformance: async (id) => {
    try {
      set({
        performanceLoading: true,
        error: null,
        userPerformance: null,
      });

      const response = await axiosInstance.get(
        `/admin/users/${id}/performance`
      );

      set({
        userPerformance: response.data,
        performanceLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        performanceLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to load user performance",
      });

      throw error;
    }
  },

  // ==========================================
  // CLEAR PERFORMANCE
  // ==========================================

  clearUserPerformance: () => {
    set({
      userPerformance: null,
    });
  },

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useAdminStore;
