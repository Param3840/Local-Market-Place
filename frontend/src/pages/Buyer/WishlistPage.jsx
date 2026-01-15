// E:\LocalMarketPlace\frontend\src\pages\Buyer\WishlistPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import UnifiedChatPopup from "../../components/UnifiedChatPopup";
import "./WishlistPage.css";
import bg from "../../assets/bg.png";
import api from "../../api";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(false);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    api
      .get(`/api/wishlist/${userId}`) // ✅ updated
      .then((res) => {
        console.log("✅ Wishlist loaded:", res.data);
        setWishlist(res.data);
      })
      .catch((err) => console.error("Failed to load wishlist", err));
  }, [userId]);

  const addToCart = async (product) => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const res = await api.post(`/api/cart/${userId}`, {
        // ✅ updated
        product,
        qty: 1,
      });

      if (!res.data || res.status !== 200) {
        alert(res.data?.error || "Failed to add to cart");
        return;
      }

      const t = document.createElement("div");
      t.textContent = `${product.name} added to cart`;
      Object.assign(t.style, {
        position: "fixed",
        right: "16px",
        bottom: "16px",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        zIndex: 9999,
      });
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 1300);
    } catch (e) {
      console.warn("addToCart", e);
      alert("Something went wrong");
    }
  };

  const remove = async (_id) => {
    try {
      await api.delete(`/api/wishlist/${userId}/${_id}`); // ✅ updated
      const next = wishlist.filter((p) => p._id !== _id);
      setWishlist(next);
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  return (
    <div
      className="wishlist-screen"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="wishlist-blur" />

      <Navbar
        links={[
          { label: "Home", href: "/buyer/page" },
          {
            label: "Messages",
            href: "#",
            onClick: () => setShowChatList(true),
          },
          { label: "Cart", href: "/buyer/cart" },
          { label: "Profile", href: "/buyer/profile" },
        ]}
      />

      <div className="wishlist-content">
        <div className="wishlist-header">
          <h2 className="wishlist-title">My Wishlist</h2>
          <div className="wishlist-count" aria-hidden="true">
            {wishlist.length}
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlist.length === 0 ? (
            <div className="empty-note">Your wishlist is empty.</div>
          ) : (
            wishlist.map((p) => (
              <div className="wishlist-card" key={p._id}>
                <div className="wishlist-media">
                  {p.image ? (
                    <img src={p.image} alt={p.name} />
                  ) : (
                    <div className="no-img">No Image</div>
                  )}
                </div>

                <button
                  className="wish-remove"
                  onClick={() => remove(p._id)}
                >
                  ✖
                </button>

                <div className="wishlist-body">
                  <div className="wish-name">{p.name}</div>
                  <div className="wish-price">
                    ₹{Number(p.price || p.revenue || 0).toFixed(2)}
                  </div>

                  <div className="wishlist-actions">
                    <button
                      className="btn-cart"
                      onClick={() => addToCart(p)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn-chat"
                      onClick={() =>
                        setSelectedChat({
                          productId: p._id,
                          buyerId: userId,
                          sellerId: p.sellerId,
                        })
                      }
                    >
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(selectedChat || showChatList) && (
        <UnifiedChatPopup
          buyerId={userId}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          showChatList={showChatList}
          onClose={() => {
            setSelectedChat(null);
            setShowChatList(false);
          }}
        />
      )}
    </div>
  );
}