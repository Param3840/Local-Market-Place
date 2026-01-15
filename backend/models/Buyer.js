const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // basic email regex
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String, // ✅ optional profile image
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Buyer", buyerSchema);
