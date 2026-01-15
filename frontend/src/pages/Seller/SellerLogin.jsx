// E:\LocalMarketPlace\frontend\src\pages\Seller\SellerLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import "./SellerLogin.css";
import bg from "../../assets/bg.png";
import api from "../../api"; // ✅ centralized API

export default function SellerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // ✅ Updated endpoint to include /api prefix
      const res = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
        role: "seller",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_type", res.data.role);
      localStorage.setItem("user_id", res.data.user.id);

      console.log("✅ Seller login successful:", {
        token: res.data.token,
        role: res.data.role,
        userId: res.data.user.id,
      });

      navigate("/seller/page");
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="seller-login-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="seller-background-blur"></div>
      <div className="seller-foreground-content">
        <Navbar
          links={[
            { label: "Home", href: "/" },
            { label: "Buyer", href: "/buyer/login" },
          ]}
        />
        <div className="seller-login-box">
          <h2 className="seller-login-title">Seller Login</h2>
          <p className="seller-login-subtitle">Sign in to manage your store</p>

          <form className="seller-login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="📧 Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
            <input
              type="password"
              placeholder="🔒 Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
            <button type="submit" className="seller-login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <p className="seller-signup-link">
            Don't have an account? <a href="/seller/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}