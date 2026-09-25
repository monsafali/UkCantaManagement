// routes/authRoutes.js
import express from "express";

import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";
import {
  adminCreateUser,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getUserPerformance,
  getAdminDashboard,
} from "../controllers/adminController.js";

const router = express.Router();

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

export default router;
