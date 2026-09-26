import express from "express";

import {
  GenerateProduct,
  SearchDate,
  SearchProduct,
  getSr,
  saveFirstWeight,
  getFirstWeight,
} from "../controllers/product.controller.js";

import { isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/sr", isAuthenticated, getSr);

router.post("/generate", isAuthenticated, GenerateProduct);

// TWO-STEP WEIGHT FLOW
router.post("/saveFirtstWeight", isAuthenticated, saveFirstWeight);

router.get("/getfirstweight", isAuthenticated, getFirstWeight);

// SEARCH / REPORT
router.post("/searchDate", isAuthenticated, SearchDate);

router.post("/search", isAuthenticated, SearchProduct);

export default router;
