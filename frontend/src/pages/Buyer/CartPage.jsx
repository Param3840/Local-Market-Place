// E:\LocalMarketPlace\frontend\src\pages\Buyer\CartPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import UnifiedChatPopup from "../../components/UnifiedChatPopup";
import "./CartPage.css";
import bg from "../../assets/bg.png";
import api from "../../api";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId || userId === "undefined") return;
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get(`/api/cart/${userId}`); // ✅ updated
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Cart load error", err);
      setCart([]);
    }
  };

  const changeQty = async (productId, delta) => {
    const item = cart.find((it) => it.product?._id === productId);
    if (!item) return;

    const newQty = Math.max(1, (item.qty || 1) + delta);

    try {
      const res = await api.put(`/api/cart/${userId}/${productId}`, {
        // ✅ updated
        qty: newQty,
      });

      const updated = res.data;
      const next = cart.map((it) =>
        it.product?._id === productId ? { ...it, qty: updated.qty } : it
      );
      setCart(next);
    } catch (err) {
      console.error("Qty update error", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/api/cart/${userId}/${productId}`); // ✅ updated
      const next = cart.filter((it) => it.product?._id !== productId);
      setCart(next);
    } catch (err) {
      console.error("Remove error", err);
    }
  };

  const clearCart = async () => {
    if (!confirm("Clear cart?")) return;
    try {
      await api.delete(`/api/cart/${userId}`); // ✅ updated
      setCart([]);
    } catch (err) {
      console.error("Clear cart error", err);
    }
  };

  const addToCartAgain = async (item) => {
    try {
      const res = await api.post(`/api/cart/${userId}`, {
        // ✅ updated
        product: item.product,
        qty: 1,
      });

      setCart([...cart, res.data]);
    } catch (err) {
      console.error("Duplicate add error", err);
    }
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (s, it) => s + Number(it.product?.price || 0) * (it.qty || 1),
      0
    );
  }, [cart]);

  return (
    <div
      className="cart-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="cart-blur" />
      <div className="cart-foreground">
        <Navbar
          links={[
            { label: "Home", href: "/buyer/page" },
            {
              label: "Messages",
              href: "#",
              onClick: () => setShowChatList(true),
            },
            { label: "Wishlist", href: "/buyer/wishlist" },
            { label: "Profile", href: "/buyer/profile" },
          ]}
        />

        <main className="cart-container">
          <h2 className="cart-title">Your Cart 🛒</h2>

          {cart.length === 0 ? (
            <div className="cart-empty">
              Your cart is empty.{" "}
              <button className="link" onClick={() => navigate("/buyer/page")}>
                Browse products
              </button>
            </div>
          ) : (
            <div className="cart-card">
              <div className="cart-items">
                {cart.map((it) => (
                  <div className="cart-item" key={it._id}>
                    <div className="item-media">
                      {it.product?.image ? (
                        <img src={it.product.image} alt={it.product.name} />
                      ) : (
                        <div className="no-thumb">No Image</div>
                      )}
                    </div>

                    <div className="item-body">
                      <div className="item-top">
                        <div className="item-name">{it.product?.name}</div>
                        <div className="item-price">
                          ₹{Number(it.product?.price || 0).toFixed(2)}
                        </div>
                      </div>

                      <div className="item-actions">
                        <div className="qty-control">
                          <button onClick={() => changeQty(it.product._id, -1)}>
                            −
                          </button>
                          <span>{it.qty || 1}</span>
                          <button onClick={() => changeQty(it.product._id, +1)}>
                            +
                          </button>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn small"
                            onClick={() => removeItem(it.product._id)}
                          >
                            Remove
                          </button>
                          <button
                            className="btn outline small"
                            onClick={() => addToCartAgain(it)}
                          >
                            Duplicate
                          </button>
                          <button
                            className="btn-chat"
                            onClick={() =>
                              setSelectedChat({
                                productId: it.product._id,
                                buyerId: userId,
                                sellerId: it.product.sellerId,
                              })
                            }
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <div>Items</div>
                  <div>{cart.reduce((s, it) => s + (it.qty || 1), 0)}</div>
                </div>

                <div className="summary-row total">
                  <div>Subtotal</div>
                  <div>₹{subtotal.toFixed(2)}</div>
                </div>

                <div className="summary-actions">
                  <button className="btn danger" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button
                    className="btn primary"
                    onClick={() => alert("Proceed to checkout (demo)")}
                  >
                    Proceed to Checkout
                  </button>
                </div>

                <div className="note">
                  Note: This is a demo checkout. Payment & shipping not implemented yet.
                </div>
              </div>
            </div>
          )}
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