const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Add product
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      category,
      description,
      image,
      sellDate,
      sellerId,
    } = req.body;

    if (!sellerId) {
      return res.status(400).json({ error: "sellerId is required" });
    }

    const newProduct = new Product({
      name,
      price,
      stock,
      category,
      description,
      image: image || "",
      sellDate: sellDate || null,
      sellerId,
    });

    await newProduct.save();

    const io = req.app.get("io");
    io.emit("new-product", newProduct);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch product by ID (🔥 THIS WAS MISSING)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch products by seller ID
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching seller products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;