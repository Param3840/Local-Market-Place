const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Product = require("../models/Product");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");

// ✅ Create or get existing conversation
router.post("/", async (req, res) => {
  const { productId, buyerId, sellerId } = req.body;

  if (!buyerId || !sellerId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ✅ Explicit roomId logic
  const roomId = productId
    ? `${productId}-${buyerId}-${sellerId}`
    : `general-${buyerId}-${sellerId}`;

  console.log("📨 Incoming conversation payload:", req.body);
  console.log("🧠 Generated roomId:", roomId);

  try {
    let convo = await Conversation.findOne({ roomId });

    if (!convo) {
      convo = await Conversation.create({
        buyerId,
        sellerId,
        productId: productId || null,
        roomId,
      });
    }

    res.json({ roomId: convo.roomId });
  } catch (err) {
    console.error("❌ Conversation error:", err);
    res.status(500).json({ error: "Failed to create or fetch conversation" });
  }
});

// ✅ Get all conversations for a seller
router.get("/seller/:sellerId", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const convos = await Conversation.find({ sellerId }).sort({ updatedAt: -1 });

    const enriched = await Promise.all(
      convos.map(async (convo) => {
        let buyerName = "Buyer";
        let productName = "General Chat";

        if (convo.buyerId) {
          const buyer = await Buyer.findById(convo.buyerId);
          if (buyer) buyerName = buyer.name;
          else {
            const sellerAsBuyer = await Seller.findById(convo.buyerId);
            if (sellerAsBuyer) buyerName = sellerAsBuyer.name;
          }
        }

        if (convo.productId) {
          const product = await Product.findById(convo.productId);
          if (product) productName = product.name;
        }

        return {
          roomId: convo.roomId,
          buyerId: convo.buyerId,
          buyerName,
          productName,
          productId: convo.productId || null, // ✅ Include productId
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("❌ Error fetching seller conversations:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all conversations for a buyer
router.get("/buyer/:buyerId", async (req, res) => {
  const { buyerId } = req.params;

  try {
    const convos = await Conversation.find({ buyerId }).sort({ updatedAt: -1 });

    const enriched = await Promise.all(
      convos.map(async (convo) => {
        let sellerName = "Seller";
        let productName = "General Chat";

        if (convo.sellerId) {
          const seller = await Seller.findById(convo.sellerId);
          if (seller) sellerName = seller.name;
        }

        if (convo.productId) {
          const product = await Product.findById(convo.productId);
          if (product) productName = product.name;
        }

        return {
          roomId: convo.roomId,
          sellerId: convo.sellerId,
          sellerName,
          productName,
          productId: convo.productId || null, // ✅ Include productId
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("❌ Error fetching buyer conversations:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;