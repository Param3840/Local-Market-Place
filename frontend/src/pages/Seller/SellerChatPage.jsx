// E:\LocalMarketPlace\frontend\src\pages\Seller\SellerChatPage.jsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedChatPopupSeller from "../../components/UnifiedChatPopupSeller";

export default function SellerChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const buyerId = queryParams.get("buyerId");

  const sellerId = localStorage.getItem("user_id");
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!sellerId) {
      alert("Please login as seller");
      navigate("/seller/login");
      return;
    }

    if (!buyerId || !productId) {
      alert("Missing chat parameters");
      navigate("/seller/page");
      return;
    }

    setSelectedChat({
      buyerId,
      sellerId,
      productId,
    });
  }, [buyerId, productId, sellerId, navigate]);

  return (
    <div>
      {selectedChat ? (
        <UnifiedChatPopupSeller
          sellerId={sellerId}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          showChatList={false}
          onClose={() => navigate("/seller/page")}
        />
      ) : (
        <p style={{ padding: "2rem", textAlign: "center" }}>Loading chat...</p>
      )}
    </div>
  );
}