import { useEffect, useState, useRef } from "react";
import api from "../api";
import socket from "../utils/socket";
import "./UnifiedChatPopup.css";

export default function UnifiedChatPopup({
  buyerId,
  selectedChat,
  setSelectedChat,
  showChatList,
  onClose,
}) {
  const [conversations, setConversations] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [productName, setProductName] = useState("");

  const currentUserId = localStorage.getItem("user_id");
  const chatEndRef = useRef(null);

  const sellerId = selectedChat?.sellerId;
  const productId = selectedChat?.productId;

  useEffect(() => {
    if (!selectedChat && showChatList) {
      api.get(`/conversations/buyer/${buyerId}`).then((res) => {
        setConversations(res.data);
      });
    }
  }, [buyerId, selectedChat, showChatList]);

  useEffect(() => {
    setRoomId("");
    setMessages([]);
    setProductName("Loading...");
    setUserName("Loading...");
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;

    async function setupChat() {
      try {
        if (productId) {
          const productRes = await api.get(`/products/${productId}`);
          setProductName(productRes.data.name || "Product");
        } else {
          setProductName("General Chat");
        }

        if (sellerId) {
          const userRes = await api.get(`/users/${sellerId}`);
          setUserName(userRes.data.name || "User");
        }

        const payload = { buyerId, sellerId };
        if (productId) payload.productId = productId;

        const convoRes = await api.post("/conversations", payload);
        const generatedRoomId = convoRes.data.roomId;

        setRoomId(generatedRoomId);
        setSelectedChat((prev) => {
          if (prev?.roomId === generatedRoomId) return prev;
          return { ...prev, roomId: generatedRoomId };
        });
      } catch (err) {
        console.error("❌ Chat setup failed:", err.message);
      }
    }

    setupChat();
  }, [selectedChat]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);

    const handleMessage = (msg) => {
      console.log("📥 Incoming message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleMessage);
    return () => socket.off("receive-message", handleMessage);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    api.get(`/messages/${roomId}`).then((res) => setMessages(res.data));
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !roomId || !currentUserId) return;

    const msg = {
      roomId,
      sender: currentUserId,
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      socket.emit("send-message", msg);
      setMessages((prev) => [...prev, msg]); // ✅ Show instantly
      setInput("");
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !roomId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId);
    formData.append("sender", currentUserId);
    formData.append("time", new Date().toLocaleTimeString());

    try {
      const res = await api.post("/messages/media", formData);
      const mediaMsg = res.data;
      setMessages((prev) => [...prev, mediaMsg]);
    } catch (err) {
      console.error("❌ Media upload failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="chat-popup-overlay">
      <div className="chat-popup-box">
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="chat-layout">
          {showChatList && (
            <aside className="chat-sidebar">
              <h3>Your Conversations</h3>
              <ul>
                {conversations.map((c, i) => (
                  <li
                    key={i}
                    className={selectedChat?.roomId === c.roomId ? "active" : ""}
                    onClick={() =>
                      setSelectedChat({
                        ...c,
                        buyerId,
                        sellerId: c.sellerId,
                        productId: c.productId,
                        roomId: c.roomId,
                      })
                    }
                  >
                    <strong>{c.sellerName || "Seller"}</strong>
                    <div className="chat-subtext">{c.productName || "General Chat"}</div>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {selectedChat && (
            <main className="chat-main">
              <header className="chat-header">
                <h4>{productName}</h4>
                <p>with {userName}</p>
              </header>

              <div className="chat-body">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-message ${
                      msg.sender?.toString() === currentUserId?.toString() ? "me" : "them"
                    }`}
                  >
                    {msg.text && <div className="bubble">{msg.text}</div>}
                    {msg.mediaUrl && (
                      <div className="bubble media-bubble">
                        {msg.mediaType?.startsWith("image") ? (
                          <>
                            <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">
                              <img
                                src={msg.mediaUrl}
                                alt="sent"
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                              />
                            </a>
                            <a
                              href={`/api/messages/download/${msg.mediaUrl.split("/").pop()}`}
                              style={{
                                display: "inline-block",
                                marginTop: "4px",
                                fontSize: "12px",
                                color: "#007bff",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              ⬇ Download
                            </a>
                          </>
                        ) : msg.mediaType?.startsWith("video") ? (
                          <video
                            src={msg.mediaUrl}
                            controls
                            style={{ maxWidth: "100%", borderRadius: "8px" }}
                          />
                        ) : (
                          <a
                            href={`/api/messages/download/${msg.mediaUrl.split("/").pop()}`}
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                              fontSize: "12px",
                              color: "#007bff",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            ⬇ Download File
                          </a>
                        )}
                      </div>
                    )}
                    <span className="timestamp">{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <footer className="chat-footer">
                <label htmlFor="media-upload" className="media-icon">📎</label>
                <input
                  type="file"
                  id="media-upload"
                  style={{ display: "none" }}
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
              </footer>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}