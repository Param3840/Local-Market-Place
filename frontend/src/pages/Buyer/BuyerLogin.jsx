// E:\LocalMarketPlace\frontend\src\pages\Buyer\BuyerLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import "./BuyerLogin.css";
import bg from "../../assets/bg.png";
import api from "../../api";

export default function BuyerLogin() {
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

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
        role: "buyer",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_type", res.data.role); // ✅ consistent key
      localStorage.setItem("user_id", res.data.user.id);

      console.log("✅ Login successful:", {
        token: res.data.token,
        role: res.data.role,
        userId: res.data.user.id,
      });

      navigate("/buyer/page");
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="buyer-login-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="buyer-background-blur"></div>
      <div className="buyer-foreground-content">
        <Navbar
          links={[
            { label: "Home", href: "/" },
            { label: "Seller", href: "/seller/login" },
          ]}
        />

        <div className="buyer-login-box">
          <h2 className="buyer-login-title">Buyer Login</h2>
          <p className="buyer-login-subtitle">Sign in to start shopping</p>

          <form className="buyer-login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="📧 Enter your email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

            <input
              type="password"
              placeholder="🔒 Enter your password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <p className="buyer-signup-link">
            Don't have an account? <a href="/buyer/signup">Sign up</a>
          </p>

          <p className="seller-login-link">
            Are you a seller? <a href="/seller/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}