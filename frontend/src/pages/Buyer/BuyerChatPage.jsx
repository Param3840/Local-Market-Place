// E:\LocalMarketPlace\frontend\src\pages\Buyer\BuyerChatPage.jsx

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../utils/socket";
import api from "../../api"; // ✅ Use api instance instead of raw axios

export default function BuyerChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const sellerId = queryParams.get("sellerId");

  const [productName, setProductName] = useState("Loading...");
  const [sellerName, setSellerName] = useState("Loading...");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const buyerId = localStorage.getItem("user_id");
  const chatEndRef = useRef(null);

  // Redirect if missing params
  useEffect(() => {
    if (!productId || !sellerId || !buyerId) {
      alert("Missing chat parameters. Redirecting...");
      navigate("/buyer/page");
    }
  }, [productId, sellerId, buyerId, navigate]);

  // Setup chat
  useEffect(() => {
    async function setupChat() {
      try {
        const productRes = await api.get(`/api/products/${productId}`);
        const sellerRes = await api.get(`/api/users/${sellerId}`);
        setProductName(productRes.data.name || "Product");
        setSellerName(sellerRes.data.name || "Seller");

        const payload = { buyerId, sellerId };
        if (productId) payload.productId = productId;

        const convoRes = await api.post("/api/conversations", payload);
        const room = convoRes.data.roomId;
        console.log("🧩 Room ID:", room);
        setRoomId(room);
      } catch (err) {
        console.error("❌ Chat setup failed:", err.message);
      }
    }

    setupChat();
  }, [productId, sellerId, buyerId]);

  // Join socket room
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleMessage);
    return () => socket.off("receive-message", handleMessage);
  }, [roomId]);

  // Load messages
  useEffect(() => {
    if (!roomId) return;

    api
      .get(`/api/messages/${roomId}`)
      .then((res) => setMessages(res.data))
      .catch((err) =>
        console.error("❌ Failed to load messages:", err.message)
      );
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;

    const msg = {
      roomId,
      sender: buyerId,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ccc",
          background: "#fff",
        }}
      >
        <h3>{productName}</h3>
        <p>with {sellerName}</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === buyerId ? "right" : "left",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: msg.sender === buyerId ? "#dcf8c6" : "#eee",
                padding: "10px 14px",
                borderRadius: "16px",
              }}
            >
              {msg.text}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#888",
                marginTop: "4px",
              }}
            >
              {msg.time}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          padding: "1rem",
          borderTop: "1px solid #ccc",
          background: "#fff",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 16px",
            borderRadius: "20px",
            background: "#4caf50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}