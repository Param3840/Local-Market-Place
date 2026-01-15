const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "buyer") {
      const exists = await Buyer.findOne({ email });
      if (exists) return res.status(400).json({ error: "Buyer already exists" });

      await Buyer.create({ name, email, password: hashedPassword });
      return res.json({ message: "Buyer registered successfully" });
    }

    if (role === "seller") {
      const exists = await Seller.findOne({ email });
      if (exists) return res.status(400).json({ error: "Seller already exists" });

      await Seller.create({ name, email, password: hashedPassword });
      return res.json({ message: "Seller registered successfully" });
    }

    return res.status(400).json({ error: "Invalid role" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "buyer") {
      user = await Buyer.findOne({ email });
    } else if (role === "seller") {
      user = await Seller.findOne({ email });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
