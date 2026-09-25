import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    Sr_No: {
      type: Number,
      required: true,
      unique: true,
    },

    vehicle: {
      type: String,
      trim: true,
    },

    Party: {
      type: String,
      required: true,
      trim: true,
    },

    Product: {
      type: String,
      required: true,
      trim: true,
    },

    ProductId: {
      type: String,
    },

    Gross: {
      type: Number,
      required: true,
    },

    Tare: {
      type: Number,
      required: true,
    },

    Net: {
      type: Number,
    },

    Cash: {
      type: Number,
      required: true,
      min: 0,
    },

    Date: {
      type: String,
    },

    GrossDate: {
      type: String,
    },

    TareDate: {
      type: String,
    },

    formDate: {
      type: String,
    },

    GrossTime: {
      type: String,
    },

    TareTime: {
      type: String,
    },

    remarks: {
      type: String,
    },

    calc40_mnds: {
      type: Number,
    },

    calc40_kg: {
      type: Number,
    },

    calc37_mnds: {
      type: Number,
    },

    calc37_kg: {
      type: Number,
    },

    // ================================================
    // USER WHO CREATED THIS ENTRY
    // ================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

// Useful for date/user queries
productSchema.index({
  user: 1,
  createdAt: -1,
});

productSchema.index({
  createdAt: -1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
