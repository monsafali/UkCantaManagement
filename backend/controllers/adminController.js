import mongoose from "mongoose";

import UserAuth from "../models/UserAuth.model.js";
import Product from "../models/Product.js";

import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

// =====================================================
// CREATE USER
// =====================================================

export const adminCreateUser = catchAsyncErrors(
  async (req, res, next) => {
    const {
      fullname,
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return next(
        new ErrorHandler("All fields are required", 400),
      );
    }

    if (password !== confirmPassword) {
      return next(
        new ErrorHandler(
          "Passwords do not match",
          400,
        ),
      );
    }

    const existingUser = await UserAuth.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return next(
        new ErrorHandler(
          "Username or email already exists",
          400,
        ),
      );
    }

    const user = await UserAuth.create({
      fullname,
      username,
      email,
      password,
      role: "User",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  },
);


export const getAllUsers = catchAsyncErrors(
  async (req, res) => {
    const users = await UserAuth.find({
      role: "User",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .lean();

    res.json({
      success: true,
      count: users.length,
      users,
    });
  },
);


export const toggleUserStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const user = await UserAuth.findById(id);

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    if (user.role === "Admin") {
      return next(
        new ErrorHandler(
          "Admin account cannot be deactivated",
          403,
        ),
      );
    }

    user.isActive = !user.isActive;

    // Invalidate existing sessions
    user.sessionVersion += 1;

    await user.save();

    res.json({
      success: true,
      message: user.isActive
        ? "User activated"
        : "User deactivated",
      isActive: user.isActive,
    });
  },
);

export const deleteUser = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const user = await UserAuth.findById(id);

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    if (user.role === "Admin") {
      return next(
        new ErrorHandler(
          "Admin cannot be deleted",
          403,
        ),
      );
    }

    await UserAuth.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  },
);

export const getUserPerformance = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const user = await UserAuth.findById(id)
      .select(
        "fullname username email role isActive createdAt",
      )
      .lean();

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    // -----------------------------------------------
    // TOTAL
    // -----------------------------------------------

    const total = await Product.aggregate([
      {
        $match: {
          user: user._id,
        },
      },

      {
        $group: {
          _id: null,

          totalEntries: {
            $sum: 1,
          },

          totalRevenue: {
            $sum: {
              $ifNull: ["$Cash", 0],
            },
          },
        },
      },
    ]);

    // -----------------------------------------------
    // DAILY
    // -----------------------------------------------

    const daily = await Product.aggregate([
      {
        $match: {
          user: user._id,
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          entries: {
            $sum: 1,
          },

          revenue: {
            $sum: {
              $ifNull: ["$Cash", 0],
            },
          },
        },
      },

      {
        $sort: {
          _id: -1,
        },
      },

      {
        $limit: 30,
      },
    ]);

    const statistics = total[0] || {
      totalEntries: 0,
      totalRevenue: 0,
    };

    res.json({
      success: true,

      user,

      statistics: {
        totalEntries:
          statistics.totalEntries,

        totalRevenue:
          statistics.totalRevenue,
      },

      daily,
    });
  },
);

export const getAdminDashboard = catchAsyncErrors(
  async (req, res) => {
    // =================================================
    // USERS
    // =================================================

    const totalUsers =
      await UserAuth.countDocuments({
        role: "User",
      });

    const activeUsers =
      await UserAuth.countDocuments({
        role: "User",
        isActive: true,
      });

    const inactiveUsers =
      totalUsers - activeUsers;

    // =================================================
    // TOTAL ENTRIES
    // =================================================

    const totalEntries =
      await Product.countDocuments();

    // =================================================
    // TOTAL REVENUE
    // =================================================

    const totalRevenue =
      await Product.aggregate([
        {
          $group: {
            _id: null,

            revenue: {
              $sum: {
                $ifNull: ["$Cash", 0],
              },
            },
          },
        },
      ]);

    // =================================================
    // TODAY
    // =================================================

    const startOfDay = new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date();

    endOfDay.setHours(
      23,
      59,
      59,
      999,
    );

    const todayStats =
      await Product.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },

        {
          $group: {
            _id: null,

            entries: {
              $sum: 1,
            },

            revenue: {
              $sum: {
                $ifNull: ["$Cash", 0],
              },
            },
          },
        },
      ]);

    // =================================================
    // LAST 30 DAYS
    // =================================================

    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 29,
    );

    thirtyDaysAgo.setHours(
      0,
      0,
      0,
      0,
    );

    const dailyPerformance =
      await Product.aggregate([
        {
          $match: {
            createdAt: {
              $gte: thirtyDaysAgo,
            },
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },

            entries: {
              $sum: 1,
            },

            revenue: {
              $sum: {
                $ifNull: ["$Cash", 0],
              },
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    // =================================================
    // USER PERFORMANCE
    // =================================================

    const userPerformance =
      await Product.aggregate([
        {
          $group: {
            _id: "$user",

            totalEntries: {
              $sum: 1,
            },

            totalRevenue: {
              $sum: {
                $ifNull: ["$Cash", 0],
              },
            },
          },
        },

        {
          $lookup: {
            from: "userauths",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },

        {
          $unwind: "$user",
        },

        {
          $match: {
            "user.role": "User",
          },
        },

        {
          $project: {
            _id: 0,

            userId: "$user._id",

            fullname:
              "$user.fullname",

            username:
              "$user.username",

            totalEntries: 1,

            totalRevenue: 1,
          },
        },

        {
          $sort: {
            totalRevenue: -1,
          },
        },
      ]);

    // =================================================
    // RESPONSE
    // =================================================

    res.json({
      success: true,

      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
      },

      overall: {
        totalEntries,

        totalRevenue:
          totalRevenue[0]?.revenue || 0,
      },

      today: {
        entries:
          todayStats[0]?.entries || 0,

        revenue:
          todayStats[0]?.revenue || 0,
      },

      dailyPerformance,

      userPerformance,
    });
  },
);



export const getAdminReports = catchAsyncErrors(
  async (req, res, next) => {
    const { from, to, userId } = req.query;

    // =================================================
    // VALIDATION
    // =================================================

    if (!from || !to) {
      return next(
        new ErrorHandler(
          "From date and to date are required",
          400
        )
      );
    }

    const startDate = new Date(
      `${from}T00:00:00.000+05:00`
    );

    const endDate = new Date(
      `${to}T23:59:59.999+05:00`
    );

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return next(
        new ErrorHandler("Invalid date", 400)
      );
    }

    if (startDate > endDate) {
      return next(
        new ErrorHandler(
          "From date cannot be greater than to date",
          400
        )
      );
    }

    // =================================================
    // MATCH
    // =================================================

    const match = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    // =================================================
    // USER FILTER
    // =================================================

    if (userId && userId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(
          new ErrorHandler(
            "Invalid user ID",
            400
          )
        );
      }

      match.user = new mongoose.Types.ObjectId(
        userId
      );
    }

    console.log("REPORT MATCH:", match);

    // =================================================
    // TOTAL
    // =================================================

    const total = await Product.aggregate([
      {
        $match: match,
      },

      {
        $group: {
          _id: null,

          totalEntries: {
            $sum: 1,
          },

          totalRevenue: {
            $sum: {
              $ifNull: ["$Cash", 0],
            },
          },
        },
      },
    ]);

    // =================================================
    // USER-WISE
    // =================================================

    const userStats = await Product.aggregate([
      {
        $match: match,
      },

      {
        $group: {
          _id: "$user",

          entries: {
            $sum: 1,
          },

          revenue: {
            $sum: {
              $ifNull: ["$Cash", 0],
            },
          },
        },
      },

      {
        $lookup: {
          from: UserAuth.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          userId: "$_id",

          fullname: "$user.fullname",

          username: "$user.username",

          email: "$user.email",

          entries: 1,

          revenue: 1,
        },
      },

      {
        $sort: {
          revenue: -1,
        },
      },
    ]);

    
    const daily = await Product.aggregate([
      {
        $match: match,
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Karachi",
            },
          },

          entries: {
            $sum: 1,
          },

          revenue: {
            $sum: {
              $ifNull: ["$Cash", 0],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const entries = await Product.find(match)
      .populate(
        "user",
        "fullname username email"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    const statistics = total[0] || {
      totalEntries: 0,
      totalRevenue: 0,
    };

    res.json({
      success: true,

      filters: {
        from,
        to,
        userId: userId || "all",
      },

      statistics: {
        totalEntries:
          statistics.totalEntries,

        totalRevenue:
          statistics.totalRevenue,
      },

      userStats,

      daily,

      entries,
    });
  }
);
