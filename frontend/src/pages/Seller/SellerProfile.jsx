import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import UnifiedChatPopupSeller from "../../components/UnifiedChatPopupSeller"; // ✅ Chat popup
import "./SellerProfile.css";
import bg from "../../assets/bg.png";
import { storage } from "../../utils/storage";
import api from "../../api";

const IMAGE_KEY = "seller_profile_image";

export default function SellerProfile() {
  const navigate = useNavigate();
  const userId = storage.getItem("user_id");
  const role = storage.getItem("user_type");

  const [profile, setProfile] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(false);
  const avatarInputRef = useRef(null);

  // 🔐 Login protection
  useEffect(() => {
    const token = storage.getItem("token");
    if (!token || role !== "seller") {
      alert("Please login as seller");
      navigate("/seller/login");
    }
  }, [navigate, role]);

  // 📥 Load seller profile
  useEffect(() => {
    if (!userId || role !== "seller") return;

    async function fetchProfile() {
      try {
        const res = await api.get(`/seller/${userId}`);
        const storedImage = storage.getItem(IMAGE_KEY);
        const fullProfile = {
          ...res.data,
          image: storedImage || res.data.avatar || null,
          rating: typeof res.data.rating === "number" ? res.data.rating : 4.8,
        };
        setProfile(fullProfile);
      } catch (err) {
        console.error("❌ Failed to load seller profile", err);
        setProfile(null);
      }
    }

    fetchProfile();
  }, [userId, role]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      const updated = { ...profile, image: base64 };
      setProfile(updated);
      storage.setItem(IMAGE_KEY, base64);
    };
    reader.readAsDataURL(file);
  };

  const formattedDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const handleLogout = () => {
    storage.removeItem("user_id");
    storage.removeItem("user_type");
    storage.removeItem("token");
    storage.removeItem(IMAGE_KEY);
    window.location.href = "/seller/login";
  };

  if (role !== "seller") {
    return <h2 style={{ padding: 40 }}>🚫 Unauthorized: Not a seller</h2>;
  }

  if (!profile) {
    return (
      <div className="seller-profile-screen" style={{ padding: 40 }}>
        <h2>Loading seller profile...</h2>
      </div>
    );
  }

  return (
    <div
      className="seller-profile-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="seller-profile-blur" />

      <Navbar
        links={[
          { label: "Home", href: "/seller/page" },
         
          {
            label: "Messages",
            href: "#",
            onClick: () => {
              setShowChatList(true);
              setSelectedChat(null);
            },
          },
        ]}
      />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="avatar-circle">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} />
              ) : (
                <div className="avatar-icon">👤</div>
              )}
            </div>

            <label className="avatar-upload-button">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
                ref={avatarInputRef}
              />
              📷
            </label>
          </div>

          <div className="profile-body no-banner">
            <div className="profile-left text-black">
              <div className="detail-row">
                <strong>Seller:</strong> <span>{profile.name}</span>
              </div>

              <div className="detail-row">
                <strong>Email:</strong> <span>{profile.email}</span>
              </div>

              <div className="detail-row">
                <strong>Joined:</strong> <span>{formattedDate(profile.joinedAt)}</span>
              </div>
            </div>

            <div className="profile-right">
              <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
            </div>
          </div>
        </div>
      </div>

      {(selectedChat || showChatList) && (
        <UnifiedChatPopupSeller
          sellerId={userId}
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
