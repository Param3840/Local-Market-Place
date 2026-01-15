const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    product: {
      type: {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        description: { type: String },
        category: { type: String },
        sellerId: { type: String, required: true }, // ✅ critical for chat
      },
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
