// E:\LocalMarketPlace\frontend\src\pages\Seller\SellerSignup.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import "./SellerSignup.css";
import bg from "../../assets/bg.png";
import api from "../../api";

export default function SellerSignup() {
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

      await api.post("/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: "seller",
      });

      alert("Signup successful! Please login.");
      navigate("/seller/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="seller-signup-screen"
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
        <div className="seller-signup-box">
          <h2 className="seller-signup-title">Seller Signup</h2>
          <p className="seller-signup-subtitle">Create your store account to start selling</p>

          <form className="seller-signup-form" onSubmit={handleSignup}>
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
            <button type="submit" className="seller-signup-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <p className="seller-login-link">
            Already have an account? <a href="/seller/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}