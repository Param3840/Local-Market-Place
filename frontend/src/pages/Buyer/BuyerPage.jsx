// E:\LocalMarketPlace\frontend\src\pages\Buyer\BuyerPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import UnifiedChatPopup from "../../components/UnifiedChatPopup";
import "./BuyerPage.css";
import bg from "../../assets/bg.png";
import api from "../../api"; // ✅ centralized API

export default function BuyerPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(false);

  const userId = localStorage.getItem("user_id") || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    if (!token || role !== "buyer") {
      alert("Please login as buyer");
      navigate("/buyer/login");
    }
  }, [navigate]);

  useEffect(() => {
    api
      .get("/api/products") // ✅ updated
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  const loadCart = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/cart/${userId}`); // ✅ updated
      setCartCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error("Failed to load cart", err);
      setCartCount(0);
    }
  };

  const loadWishlist = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/wishlist/${userId}`); // ✅ updated
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to load wishlist", err);
      setWishlist([]);
    }
  };

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

      loadCart();
    } catch (e) {
      console.warn("addToCart", e);
      alert("Something went wrong");
    }
  };

  const toggleWishlist = async (product) => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    const exists = wishlist.find((w) => w._id === product._id);

    if (exists) {
      await api.delete(`/api/wishlist/${userId}/${product._id}`); // ✅ updated
      setWishlist(wishlist.filter((w) => w._id !== product._id));
    } else {
      const res = await api.post(`/api/wishlist/${userId}`, product); // ✅ updated
      if (!res.data || res.status !== 200) {
        alert("Failed to add to wishlist");
        return;
      }
      setWishlist([res.data, ...wishlist]);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((w) => w._id === productId);

  const filtered = products.filter((p) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="buyer-page-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="buyer-background-blur" aria-hidden="true"></div>

      <div className="buyer-foreground-content">
        <Navbar
          links={[
            { label: "Messages", href: "#", onClick: () => setShowChatList(true) },
            { label: "Wishlist", href: "/buyer/wishlist" },
            { label: "Cart", href: "/buyer/cart" },
            { label: "Profile", href: "/buyer/profile" },
          ]}
        />

        <main className="buyer-dashboard">
          <div className="search-row">
            <input
              className="product-search"
              placeholder="Search products, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <section className="products-grid" aria-label="Products">
            {filtered.length === 0 ? (
              <div className="empty-note">No products found.</div>
            ) : (
              filtered.map((p) => (
                <article className="product-card" key={p._id}>
                  <div className="product-media">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <button
                      className={`wish-icon ${isInWishlist(p._id) ? "active" : ""}`}
                      onClick={() => toggleWishlist(p)}
                      aria-label={
                        isInWishlist(p._id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      title={
                        isInWishlist(p._id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {isInWishlist(p._id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="product-bottom">
                    <div className="info-left">
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-price">
                        ₹{Number(p.price || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="info-right">
                      <button className="btn-add" onClick={() => addToCart(p)}>
                        Add
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
                </article>
              ))
            )}
          </section>
        </main>
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