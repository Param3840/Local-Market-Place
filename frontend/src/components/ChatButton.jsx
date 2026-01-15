import useOpenChat from "../utils/openChat";

export default function ChatButton({ productId, sellerId }) {
  const openChat = useOpenChat();

  const handleClick = () => {
    const buyerId = localStorage.getItem("user_id");
    if (!buyerId || !sellerId || !productId) {
      console.warn("Missing chat parameters");
      return;
    }

    openChat({
      productId,
      buyerId,
      sellerId,
    });
  };

  return <button onClick={handleClick}>Chat</button>;
}