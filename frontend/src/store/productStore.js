import { create } from "zustand";
import axiosInstance from "../api/axios";

const useProductStore = create((set) => ({
  // =========================
  // STATE
  // =========================

  srNo: "",
  loading: false,
  error: null,

  // =========================
  // GET NEXT SR NUMBER
  // =========================

  getSr: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await axiosInstance.get("/sr");

      set({
        srNo: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error("SR fetch failed:", error);

      const message =
        error.response?.data?.message || "Failed to get serial number";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  // =========================
  // GENERATE STAMP
  // =========================

  generateStamp: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await axiosInstance.post("/generate", data, {
        responseType: "blob",
      });

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Generate stamp failed:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to generate stamp",
      });

      throw error;
    }
  },

  // =========================
  // SEARCH STAMP
  // =========================

  searchStamp: async (Sr_No) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await axiosInstance.post(
        "/search",
        {
          Sr_No,
        },
        {
          responseType: "blob",
        },
      );

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Search stamp failed:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Stamp not found",
      });

      throw error;
    }
  },

  // =========================
  // DOWNLOAD REPORT
  // =========================

  downloadReport: async (fromDate, toDate) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await axiosInstance.post(
        "/searchDate",
        {
          fromDate,
          toDate,
        },
        {
          responseType: "blob",
        },
      );

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Report download failed:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to download report",
      });

      throw error;
    }
  },

  // =========================
  // DELETE PRODUCT
  // =========================

  deleteProduct: async (SrNo) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await axiosInstance.delete(`/product/${SrNo}`);

      set({
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Delete product failed:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete product",
      });

      throw error;
    }
  },

  // =========================
  // CLEAR ERROR
  // =========================

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useProductStore;
