import { useNavigate } from "react-router-dom";

export default function useOpenChat() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 'buyer' or 'seller'

  const openChat = ({ productId, buyerId, sellerId }) => {
    if (role === "buyer") {
      navigate(`/buyer/chat?productId=${productId}&sellerId=${sellerId}`);
    } else {
      navigate(`/seller/chat?productId=${productId}&buyerId=${buyerId}`);
    }
  };

  return openChat;
}