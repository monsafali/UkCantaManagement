import { create } from "zustand";
import axiosInstance from "../api/axios";

const useProductStore = create((set) => ({
  // ==================================================
  // STATE
  // ==================================================

  srNo: "",
  loading: false,
  error: null,

  // ==================================================
  // GET SR
  // ==================================================

  getSr: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await axiosInstance.get("/sr");

      set({
        srNo: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error(
        "SR fetch failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to get serial number";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  // ==================================================
  // SAVE FIRST WEIGHT
  // ==================================================

  saveFirstWeight: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await axiosInstance.post(
          "/saveFirtstWeight",
          data
        );

      set({
        loading: false,
        srNo: response.data.srNo,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Save first weight failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to save first weight";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  // ==================================================
  // GET FIRST WEIGHT
  // ==================================================

  getFirstWeight: async (Sr_No) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await axiosInstance.get(
          "/getfirstweight",
          {
            params: {
              Sr_No,
            },
          }
        );

      set({
        loading: false,
      });

      return response.data.product;
    } catch (error) {
      console.error(
        "Get first weight failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        "First weight not found";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  // ==================================================
  // GENERATE STAMP
  // ==================================================

  generateStamp: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await axiosInstance.post(
          "/generate",
          data,
          {
            responseType: "blob",
          }
        );

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Generate stamp failed:",
        error
      );

      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Failed to generate stamp",
      });

      throw error;
    }
  },

  // ==================================================
  // SEARCH STAMP
  // ==================================================

  searchStamp: async (Sr_No) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await axiosInstance.post(
          "/search",
          {
            Sr_No,
          },
          {
            responseType: "blob",
          }
        );

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Search stamp failed:",
        error
      );

      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Stamp not found",
      });

      throw error;
    }
  },

  // ==================================================
  // REPORT
  // ==================================================

  downloadReport: async (
    fromDate,
    toDate
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response =
        await axiosInstance.post(
          "/searchDate",
          {
            fromDate,
            toDate,
          },
          {
            responseType: "blob",
          }
        );

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Report download failed:",
        error
      );

      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Failed to download report",
      });

      throw error;
    }
  },

  // ==================================================
  // CLEAR ERROR
  // ==================================================

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useProductStore;
