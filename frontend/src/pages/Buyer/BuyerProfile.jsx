// E:\LocalMarketPlace\frontend\src\pages\Buyer\BuyerProfile.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import UnifiedChatPopup from "../../components/UnifiedChatPopup";
import "./BuyerProfile.css";
import bg from "../../assets/bg.png";
import api from "../../api";

const IMAGE_KEY = "buyer_profile_image";

export default function BuyerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(false);

  const userId = localStorage.getItem("user_id") || "";
  const role = localStorage.getItem("user_type");

  // 🔐 Login protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || role !== "buyer") {
      alert("Please login as buyer");
      navigate("/buyer/login");
    }
  }, [navigate, role]);

  useEffect(() => {
    if (!userId || role !== "buyer") return;

    api
      .get(`/api/buyer/${userId}`) // ✅ updated
      .then((res) => {
        const storedImage = localStorage.getItem(IMAGE_KEY);
        const fullProfile = { ...res.data, image: storedImage || null };
        setProfile(fullProfile);
      })
      .catch((err) => {
        console.error("❌ Failed to load buyer profile", err);
        setProfile(null);
      });
  }, [userId, role]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      const updated = { ...profile, image: base64 };
      setProfile(updated);
      localStorage.setItem(IMAGE_KEY, base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    const updated = { ...profile, image: null };
    setProfile(updated);
    localStorage.removeItem(IMAGE_KEY);
  };

  const formattedDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    localStorage.removeItem("token");
    localStorage.removeItem(IMAGE_KEY);
    window.location.href = "/buyer/login";
  };

  if (role !== "buyer") {
    return <h2 style={{ padding: 40 }}>🚫 Unauthorized: Not a buyer</h2>;
  }

  return (
    <div
      className="buyer-profile-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="buyer-profile-blur" />

      <Navbar
        links={[
          { label: "Home", href: "/buyer/page" },
          {
            label: "Messages",
            href: "#",
            onClick: () => setShowChatList(true),
          },
          { label: "Wishlist", href: "/buyer/wishlist" },
          { label: "Cart", href: "/buyer/cart" },
        ]}
      />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="avatar-circle">
              {profile?.image ? (
                <img src={profile.image} alt={profile.name} />
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                    fill="#000"
                  />
                  <path
                    d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                    stroke="#000"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <label className="avatar-upload-button">
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              📷
            </label>

            {profile?.image && (
              <button className="avatar-remove-button" onClick={removeImage}>
                ✖
              </button>
            )}
          </div>

          <div className="profile-body">
            <div className="profile-left">
              <h2 className="profile-title">{profile?.name || "Loading..."}</h2>

              <div className="detail-row">
                Email: <span>{profile?.email || "Loading..."}</span>
              </div>

              <div className="detail-row">
                Joined: <span>{formattedDate(profile?.joinedAt)}</span>
              </div>

              <div className="about">
                This is your buyer profile. You can update your profile picture or logout.
              </div>

              <div style={{ marginTop: 14 }}>
                <button className="advertisement-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(selectedChat || showChatList) && (
        <UnifiedChatPopup
          buyerId={userId}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          showChatList={showChatList}
          onClose={() => {
            setSelectedChat(null);
            setShowChatList(false);
          }}
        />
      )}
    </div>
  );
}