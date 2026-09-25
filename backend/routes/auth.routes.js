// routes/authRoutes.js
import express from "express";

import { isAuthenticated } from "../middleware/isAuth.js";
import {
  loginUser,
  logoutUser,
  GetMe,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/Getme", isAuthenticated, GetMe);

export default router;
