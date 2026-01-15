// E:\LocalMarketPlace\frontend\src\pages\Buyer\BuyerSignup.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import "./BuyerSignup.css";
import bg from "../../assets/bg.png";
import api from "../../api"; // ✅ use centralized API instance

export default function BuyerSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ Updated to use /api/auth/signup and centralized api instance
      const res = await api.post("/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: "buyer",
      });

      alert("Signup successful! Please login.");
      navigate("/buyer/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="buyer-signup-screen"
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
        <div className="buyer-signup-box">
          <h2 className="buyer-signup-title">Buyer Signup</h2>
          <p className="buyer-signup-subtitle">Create your account to start shopping</p>

          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="👤 Full Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
            <input
              type="email"
              placeholder="📧 Email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <input
              type="password"
              placeholder="🔒 Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <input
              type="password"
              placeholder="🔒 Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
              style={{ background: "rgba(255,255,255,0.15)", color: "#000" }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <p className="buyer-login-link">
            Already have an account? <a href="/buyer/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}