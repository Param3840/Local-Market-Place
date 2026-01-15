import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { storage } from "./utils/storage";

// Home
import Homepage from "./pages/HomeScreen/Homepage";

// Buyer Pages
import BuyerLogin from "./pages/Buyer/BuyerLogin";
import BuyerSignup from "./pages/Buyer/BuyerSignup";
import BuyerPage from "./pages/Buyer/BuyerPage";
import CartPage from "./pages/Buyer/CartPage";
import WishlistPage from "./pages/Buyer/WishlistPage";
import BuyerProfile from "./pages/Buyer/BuyerProfile";
import BuyerChatPage from "./pages/Buyer/BuyerChatPage"; // ✅ NEW

// Seller Pages
import SellerLogin from "./pages/Seller/SellerLogin";
import SellerSignup from "./pages/Seller/SellerSignup";
import SellerPage from "./pages/Seller/SellerPage";
import SellerHistory from "./pages/Seller/SellerHistory";
import SellerProfile from "./pages/Seller/SellerProfile";
import SellerChatPage from "./pages/Seller/SellerChatPage"; // ✅ NEW

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = storage.getItem("token");
    const role = storage.getItem("role");

    if (location.pathname === "/") {
      if (token && role === "buyer") {
        navigate("/buyer/page");
      } else if (token && role === "seller") {
        navigate("/seller/page");
      }
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Homepage />} />

      {/* Buyer Auth */}
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route path="/buyer/signup" element={<BuyerSignup />} />

      {/* Buyer Dashboard */}
      <Route path="/buyer/page" element={<BuyerPage />} />
      <Route path="/buyer/cart" element={<CartPage />} />
      <Route path="/buyer/wishlist" element={<WishlistPage />} />
      <Route path="/buyer/profile" element={<BuyerProfile />} />
      <Route path="/buyer/chat" element={<BuyerChatPage />} /> {/* ✅ NEW */}

      {/* Seller Auth */}
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/seller/signup" element={<SellerSignup />} />

      {/* Seller Dashboard */}
      <Route path="/seller/page" element={<SellerPage />} />
      <Route path="/seller/history" element={<SellerHistory />} />
      <Route path="/seller/profile" element={<SellerProfile />} />
      <Route path="/seller/chat" element={<SellerChatPage />} /> {/* ✅ NEW */}

      {/* Redirects */}
      <Route path="/buyer" element={<Navigate to="/buyer/page" replace />} />
      <Route path="/seller" element={<Navigate to="/seller/page" replace />} />

      {/* Fallback */}
      <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
    </Routes>
  );
}

export default App;