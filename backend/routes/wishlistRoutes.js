const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");

// ✅ Get all wishlist items for a user
router.get("/:userId", async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.params.userId });

    const formatted = items.map((item) => {
      const p = item.product || {};
      return {
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        description: p.description,
        sellerId: p.sellerId || null, // ✅ ensure sellerId is passed
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Failed to fetch wishlist:", err.message);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// ✅ Add product to wishlist
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const product = req.body;

    // Validate sellerId
    if (!product.sellerId) {
      return res.status(400).json({ error: "Missing sellerId in product" });
    }

    // Check if already exists
    const exists = await Wishlist.findOne({ userId, "product._id": product._id });
    if (exists) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    const newItem = new Wishlist({ userId, product });
    await newItem.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Failed to add to wishlist:", err.message);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// ✅ Remove product from wishlist
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const result = await Wishlist.deleteOne({ userId, "product._id": productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to remove from wishlist:", err.message);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

module.exports = router;
