import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sessionVersion: {
      type: Number,
      default: 0,
    },

    singleDeviceEnforced: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// HASH PASSWORD
// =====================================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);


});

// =====================================================
// COMPARE PASSWORD
// =====================================================

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// =====================================================
// GENERATE JWT
// =====================================================

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      role: this.role,
      sessionVersion: this.sessionVersion,
    },

    process.env.JWT_SECRET_KEY,

    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    },
  );
};

const UserAuth = mongoose.model("UserAuth", userSchema);

export default UserAuth;
