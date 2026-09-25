import UserAuth from "../models/UserAuth.model.js";
import Product from "../models/Product.js";


import { ErrorHandler } from "../middleware/errorMiddleware.js";

import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";



export const adminCreateUser = catchAsyncErrors(async (req, res, next) => {
  const { fullname, username, email, password,confirmPassword } = req.body;

  if (!fullname || !username || !email || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if(password !== confirmPassword){
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  const existingUser = await UserAuth.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return next(new ErrorHandler("Username or email already exists", 400));
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
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

export const getAllUsers = catchAsyncErrors(async (req, res) => {
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
});

export const toggleUserStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserAuth.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "Admin") {
    return next(new ErrorHandler("Admin account cannot be deactivated", 403));
  }

  user.isActive = !user.isActive;

  // Invalidate existing sessions
  user.sessionVersion += 1;

  await user.save();

  res.json({
    success: true,
    message: user.isActive ? "User activated" : "User deactivated",

    isActive: user.isActive,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserAuth.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "Admin") {
    return next(new ErrorHandler("Admin cannot be deleted", 403));
  }

  await UserAuth.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});



export const getUserPerformance = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserAuth.findById(id)
    .select("fullname username email role isActive createdAt")
    .lean();

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // ============================================
  // TOTAL PERFORMANCE
  // ============================================

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
          $sum: "$Cash",
        },
      },
    },
  ]);

  // ============================================
  // DAILY PERFORMANCE
  // ============================================

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
          $sum: "$Cash",
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
      totalEntries: statistics.totalEntries,

      totalRevenue: statistics.totalRevenue,
    },

    daily,
  });
});




export const getAdminDashboard = catchAsyncErrors(
  async (req, res) => {
    // ============================================
    // USERS
    // ============================================

    const totalUsers = await UserAuth.countDocuments({
      role: "User",
    });

    const activeUsers = await UserAuth.countDocuments({
      role: "User",
      isActive: true,
    });

    const inactiveUsers = totalUsers - activeUsers;

    // ============================================
    // TOTAL ENTRIES
    // ============================================

    const totalEntries =
      await Product.countDocuments();

    // ============================================
    // TOTAL REVENUE
    // ============================================

    const totalRevenue = await Product.aggregate([
      {
        $group: {
          _id: null,

          revenue: {
            $sum: "$Cash",
          },
        },
      },
    ]);

    // ============================================
    // TODAY
    // ============================================

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

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
              $sum: "$Cash",
            },
          },
        },
      ]);

    // ============================================
    // DAILY PERFORMANCE - LAST 30 DAYS
    // ============================================

    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 29
    );

    thirtyDaysAgo.setHours(0, 0, 0, 0);

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
              $sum: "$Cash",
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    // ============================================
    // USER PERFORMANCE
    // ============================================

    const userPerformance =
      await Product.aggregate([
        {
          $group: {
            _id: "$user",

            totalEntries: {
              $sum: 1,
            },

            totalRevenue: {
              $sum: "$Cash",
            },
          },
        },

        {
          $lookup: {
            from: "users",

            localField: "_id",

            foreignField: "_id",

            as: "user",
          },
        },

        {
          $unwind: "$user",
        },

        {
          $project: {
            _id: 0,

            userId: "$user._id",

            fullname: "$user.fullname",

            username: "$user.username",

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

    // ============================================
    // RESPONSE
    // ============================================

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
  }
);
