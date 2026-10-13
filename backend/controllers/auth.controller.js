import { ErrorHandler } from "../middleware/errorMiddleware.js";

import UserAuth from "../models/UserAuth.model.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { setTokenCookieAndSend } from "../utils/jwtToken.js";


export const loginUser = catchAsyncErrors(
  async (req, res, next) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return next(
        new ErrorHandler(
          "Username, password, and role are required",
          400
        )
      );
    }

    const user = await UserAuth.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return next(
        new ErrorHandler("User not found", 404)
      );
    }

    if (!user.isActive) {
      return next(
        new ErrorHandler(
          "Your account has been deactivated",
          403
        )
      );
    }

    if (user.role !== role) {
      return next(
        new ErrorHandler(
          `Invalid role selected. This account belongs to '${user.role}'`,
          403
        )
      );
    }

    const isMatch = await user.comparePassword(
      password
    );

    if (!isMatch) {
      return next(
        new ErrorHandler(
          "Invalid credentials",
          401
        )
      );
    }

    // IMPORTANT:
    // This already sends the response.
    return setTokenCookieAndSend(
      res,
      user,
      200,
      "Logged in successfully"
    );
  }
);


export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.singleDeviceEnforced) {
    user.sessionVersion = 0;
    await user.save();
  }
  res
    .status(200)
    .clearCookie("jwt-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })
    .json({ success: true, message: "Logged out successfully" });
});

export const GetMe = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id).select("-password");
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, user });
});
