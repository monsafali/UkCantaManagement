// routes/adminRoutes.js

import express from "express";

import {
  adminCreateUser,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getUserPerformance,
  getAdminDashboard,
  getAdminReports,
} from "../controllers/adminController.js";

import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();

// ================================================
// DASHBOARD
// ================================================

router.get(
  "/dashboard",
  isAuthenticated,
  authorizedRole("Admin"),
  getAdminDashboard,
);

// ================================================
// USERS
// ================================================

router.post(
  "/users",
  isAuthenticated,
  authorizedRole("Admin"),
  adminCreateUser,
);

router.get("/users", isAuthenticated, authorizedRole("Admin"), getAllUsers);

router.patch(
  "/users/:id/status",
  isAuthenticated,
  authorizedRole("Admin"),
  toggleUserStatus,
);

router.delete(
  "/users/:id",
  isAuthenticated,
  authorizedRole("Admin"),
  deleteUser,
);

// ================================================
// USER PERFORMANCE
// ================================================

router.get(
  "/users/:id/performance",
  isAuthenticated,
  authorizedRole("Admin"),
  getUserPerformance,
);

// ================================================
// REPORTS
// ================================================

router.get(
  "/reports",
  isAuthenticated,
  authorizedRole("Admin"),
  getAdminReports,
);

export default router;
