const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

// ✅ Get all cart items for a user
router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// ✅ Add product to cart
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { product, qty = 1 } = req.body;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!product || !product._id || !product.sellerId) {
      return res.status(400).json({ error: "Missing product or sellerId" });
    }

    const exists = await Cart.findOne({ userId, "product._id": product._id });
    if (exists) {
      exists.qty += qty;
      await exists.save();
      return res.json(exists);
    }

    const newItem = new Cart({ userId, product, qty });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// ✅ Update quantity
router.put("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { qty } = req.body;

    const item = await Cart.findOne({ userId, "product._id": productId });
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.qty = Math.max(1, Number(qty) || 1);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

// ✅ Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Cart.deleteOne({ userId, "product._id": productId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// ✅ Clear entire cart
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.params.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
