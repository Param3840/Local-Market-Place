// E:\LocalMarketPlace\frontend\src\pages\Seller\SellerPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import AddProductModal from "./AddProductModal";
import UnifiedChatPopupSeller from "../../components/UnifiedChatPopupSeller";
import "./SellerPage.css";

import revenueIcon from "../../assets/revenue.png";
import productIcon from "../../assets/product.png";
import salesIcon from "../../assets/sales.png";
import bg from "../../assets/bg.png";
import api from "../../api";

function formatDateISO(isoString) {
  if (!isoString) return "-";
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

export default function SellerPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(false);

  const sellerId = localStorage.getItem("user_id") || "";
  const role = localStorage.getItem("user_type");
  const sellerName = localStorage.getItem("sellerName") || "Seller";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || role !== "seller") {
      alert("Please login as seller");
      navigate("/seller/login");
    }
  }, [navigate, role]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products"); // ✅ updated
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const totalRevenue = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
  const productCount = products.length;

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setModalOpen(false);
  };

  const handleToggleSold = (id) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;

    const alreadySold = soldProducts.includes(id);
    const updatedSold = alreadySold
      ? soldProducts.filter((pid) => pid !== id)
      : [...soldProducts, id];

    setSoldProducts(updatedSold);

    const updatedSales = alreadySold
      ? totalSales - Number(product.price || 0)
      : totalSales + Number(product.price || 0);

    setTotalSales(updatedSales);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/api/products/${id}`); // ✅ updated
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/seller/login");
  };

  return (
    <div
      className="seller-page-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="seller-background-blur"></div>

      <div className="seller-page-content">
        <Navbar
          links={[
            { label: "Messages", href: "#", onClick: () => setShowChatList(true) },
            { label: "Profile", href: "/seller/profile" },
          ]}
        />

        <main className="seller-dashboard">
          <div className="dashboard-header">
            <div className="welcome-text">
              Welcome, <span>{sellerName}</span>
            </div>
            <div className="dashboard-title-right">Dashboard</div>
          </div>

          <div className="card-container">
            <div className="card--metric">
              <div className="metric-text">
                <div className="metric-title">Total Revenue</div>
                <div className="metric-value">₹{totalRevenue.toFixed(2)}</div>
              </div>
              <div className="metric-icon">
                <img src={revenueIcon} alt="Revenue" />
              </div>
            </div>

            <div className="card--metric secondary">
              <div className="metric-text">
                <div className="metric-title">Total Products</div>
                <div className="metric-value">{productCount}</div>
              </div>
              <div className="metric-icon">
                <img src={productIcon} alt="Products" />
              </div>
            </div>

            <div className="card--metric tertiary">
              <div className="metric-text">
                <div className="metric-title">Total Sales</div>
                <div className="metric-value">₹{totalSales.toFixed(2)}</div>
              </div>
              <div className="metric-icon">
                <img src={salesIcon} alt="Sales" />
              </div>
            </div>
          </div>

          <div className="actions-row">
            <button className="add-product-btn" onClick={() => setModalOpen(true)}>
              ➕ Add Product
            </button>

            <button className="history-btn" onClick={() => navigate("/seller/history")}>
              History & Sold
            </button>
          </div>

          <section className="product-table">
            <h3>Your Products (Active)</h3>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Post Date</th>
                  <th>Sell</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No products added yet.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td>{p.category}</td>
                      <td>{formatDateISO(p.createdAt)}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={soldProducts.includes(p._id)}
                          onChange={() => handleToggleSold(p._id)}
                          style={{
                            width: "20px",
                            height: "20px",
                            accentColor: soldProducts.includes(p._id) ? "green" : "gray",
                            cursor: "pointer",
                          }}
                        />
                      </td>
                      <td>
                        <button className="icon-btn" onClick={() => handleDeleteProduct(p._id)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      {modalOpen && (
        <AddProductModal onClose={() => setModalOpen(false)} onAdd={handleAddProduct} />
      )}

      {(selectedChat || showChatList) && (
        <UnifiedChatPopupSeller
          sellerId={sellerId}
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