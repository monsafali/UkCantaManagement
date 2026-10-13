import express from "express";

import cors from "cors";
import dotenv from "dotenv";

import ProductRoute from "./routes/product.route.js";
import AuthRoutes from "./routes/auth.routes.js";
import AdminRoutes from "./routes/admin.routes.js";

import cookieParser from "cookie-parser";

import { connectDB } from "./config/database.js";

import { seedSuperAdmin } from "./utils/seed.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1", ProductRoute);
app.use(errorMiddleware);

app.listen(PORT, async () => {
  await connectDB();
  await seedSuperAdmin();
  console.log(`Server running on port ${PORT}`);
});
