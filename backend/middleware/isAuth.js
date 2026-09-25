import jwt from "jsonwebtoken";

import UserAuth from "../models/UserAuth.model.js";

import {
  ErrorHandler,
} from "./errorMiddleware.js";


export const isAuthenticated = async (
  req,
  res,
  next
) => {
  try {
    let token = null;

    // COOKIE
    if (
      req.cookies &&
      req.cookies["jwt-token"]
    ) {
      token =
        req.cookies["jwt-token"];
    }

    // BEARER TOKEN
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    if (!token) {
      return next(
        new ErrorHandler(
          "Not logged in",
          401
        )
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    const user =
      await UserAuth.findById(
        decoded.userId
      );

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404
        )
      );
    }

    // ================================================
    // ACTIVE CHECK
    // ================================================

    if (!user.isActive) {
      return next(
        new ErrorHandler(
          "Your account has been deactivated",
          403
        )
      );
    }

    // ================================================
    // SESSION VERSION CHECK
    // ================================================

    if (
      decoded.sessionVersion !==
      user.sessionVersion
    ) {
      return next(
        new ErrorHandler(
          "Session expired. Please login again.",
          401
        )
      );
    }

    req.user = user;

    next();

  } catch (err) {
    return next(
      new ErrorHandler(
        "Invalid or expired token",
        401
      )
    );
  }
};


// =====================================================
// RBAC
// =====================================================

export const authorizedRole =
  (...roles) =>
  (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
