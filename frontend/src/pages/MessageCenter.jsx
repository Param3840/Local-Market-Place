// E:\LocalMarketPlace\frontend\src\pages\MessageCenter.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ centralized API instance

export default function MessageCenter() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("user_type"); // ✅ corrected key from 'role' to 'user_type'

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await api.get(`/api/conversations/${userId}`); // ✅ updated to use api instance
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchConversations();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleOpenChat = (conv) => {
    const { productId, buyerId, sellerId } = conv;
    const query = new URLSearchParams();

    if (productId) query.append("productId", productId);
    if (userRole === "buyer") {
      if (sellerId) query.append("sellerId", sellerId);
      navigate(`/buyer/chat?${query.toString()}`);
    } else {
      if (buyerId) query.append("buyerId", buyerId);
      navigate(`/seller/chat?${query.toString()}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Conversations</h2>

      {loading ? (
        <p>Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversations.map((conv, i) => (
            <li
              key={i}
              onClick={() => handleOpenChat(conv)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: "#f0f0f0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <strong>{conv.productName || "General Chat"}</strong>
              <br />
              with {userRole === "buyer" ? conv.sellerName : conv.buyerName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}