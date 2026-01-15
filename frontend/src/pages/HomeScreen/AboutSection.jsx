import React from "react";
import "./AboutSection.css";
import aboutImg from "../../assets/about.png";

export default function AboutSection({ id = "about" }) {
  return (
    <section id={id} className="about-section">
      <div className="about-container">
        <div className="about-image">
          <img src={aboutImg} alt="About Local Market Place" className="about-img" />
        </div>
        <div className="about-content">
          <h2 className="about-title">About Local Market Place</h2>
          <p className="about-text">
            Local Market Place is a community-driven platform that connects local buyers with local sellers.
            It supports small businesses, promotes regional products, and fosters economic growth within the community.
            Our mission is to empower local commerce through a vibrant, animated shopping experience.
          </p>
        </div>
      </div>
    </section>
  );
}
