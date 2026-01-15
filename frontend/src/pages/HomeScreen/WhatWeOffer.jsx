import React, { useState } from "react";
import "./WhatWeOffer.css";

const offers = [
  {
    title: "Buyer",
    content: "Explore authentic local products with personalized recommendations.",
  },
  {
    title: "Seller",
    content: "Smart tools to manage your business and reach local buyers effectively.",
  },
  {
    title: "Secure Payments",
    content: "Safe and transparent transactions for buyers and sellers. Integrated payment gateway ensures trust and reliability.",
  },
  {
    title: "Community",
    content: "Connect with local sellers and buyers to grow together. Share feedback, build trust, and strengthen your marketplace presence.",
  },
];

export default function WhatWeOffer({ id = "offer" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCard = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id={id} className="offer-section">
      <h2 className="section-title">What We Offer</h2>
      <div className="card-layout">
        {offers.map((item, index) => (
          <div
            key={index}
            className={`card ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleCard(index)}
            style={{
              transform:
                activeIndex === index
                  ? "scale(1.05) rotate(0deg)"
                  : `rotate(${index % 2 === 0 ? -6 : 6}deg) translateX(${index * -40}px)`,
              zIndex: activeIndex === index ? 10 : index,
            }}
          >
            <h3 className="card-title">{item.title}</h3>
            {activeIndex === index && (
              <div className="card-content">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
