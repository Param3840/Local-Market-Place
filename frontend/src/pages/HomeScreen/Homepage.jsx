import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AboutSection from "./AboutSection";
import WhatWeOffer from "./WhatWeOffer";
import ContactSection from "./ContactSection";
import homescreenCart from "../../assets/homescreenCart.png";
import "./Homepage.css";

export default function Homepage() {
  const navigate = useNavigate();

  // 🔐 Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");

    // Delay to ensure routing context is ready
    setTimeout(() => {
      if (token && role === "buyer") {
        navigate("/buyer/page");
      } else if (token && role === "seller") {
        navigate("/seller/page");
      }
    }, 100);
  }, [navigate]);

  return (
    <div className="home-screen">
      <div className="background-blur"></div>
      <div className="foreground-content">
        <Navbar
          links={[
            { label: "Home", href: "#home" },
            { label: "About", href: "#about" },
            { label: "We Offer", href: "#offer" },
            { label: "Contact", href: "#contact" },
          ]}
        />

        <main className="hero-section" id="home">
          <div className="hero-content">
            <h1 className="hero-title">Local Market Place</h1>
            <p className="subtitle">Welcome to our e-commerce website</p>
            <div className="cta-buttons">
              <button
                className="btn-buyer"
                onClick={() => navigate("/buyer/login")}
              >
                Explore as Buyer
              </button>
              <button
                className="btn-seller"
                onClick={() => navigate("/seller/login")}
              >
                Explore as Seller
              </button>
            </div>
          </div>

          <div className="hero-image">
            <img src={homescreenCart} alt="Shopping Cart" className="hero-img" />
          </div>
        </main>

        <AboutSection id="about" />
        <WhatWeOffer id="offer" />
        <ContactSection id="contact" />
      </div>
    </div>
  );
}