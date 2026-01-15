import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomeScreen/Navbar";
import "./SellerPage.css";
import bg from "../../assets/bg.png";

const HISTORY_KEY = "seller_product_history_v1";

function formatDateISO(isoString) {
  if (!isoString) return "-";
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

export default function SellerHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setHistory(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.warn("Invalid history data", e);
      setHistory([]);
    }
  };

  const handleDeletePermanent = (id) => {
    const confirmed = window.confirm("Permanently delete this history item?");
    if (!confirmed) return;

    const next = history.filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setHistory(next);
  };

  const clearAll = () => {
    const confirmed = window.confirm("Clear ALL sold history?");
    if (!confirmed) return;
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
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
            { label: "Home", href: "/" },
            { label: "Logout", href: "/seller/login" },
          ]}
        />

        <main className="seller-dashboard">
          <h2 className="dashboard-title">Sold Items History</h2>
          <p className="dashboard-subtitle">Products you marked as sold.</p>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 15 }}>
            <button className="add-product-btn" onClick={() => navigate("/seller/page")}>
              ← Back to Seller
            </button>

            <button className="history-btn" onClick={clearAll}>
              Clear All
            </button>
          </div>

          {/* History List */}
          <div className="history-modal-body" style={{ padding: 0 }}>
            {history.length === 0 ? (
              <p className="muted" style={{ padding: "1rem" }}>No sold items yet.</p>
            ) : (
              <ul className="history-list" style={{ padding: "0.6rem" }}>
                {history.map((h) => (
                  <li key={h.id}>
                    <div className="history-left">
                      <div className="history-thumb small">
                        {h.image ? (
                          <img src={h.image} alt={h.name} />
                        ) : (
                          <div className="no-thumb">No Image</div>
                        )}
                      </div>

                      <div>
                        <div className="history-name">{h.name}</div>
                        <div className="history-cat muted">{h.category}</div>
                        <div style={{ fontSize: "0.8rem" }}>
                          Sold at: {h.soldAt ? formatDateISO(h.soldAt) : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="history-right">
                      <div className="history-rev">
                        ₹{Number(h.revenue).toLocaleString()}
                      </div>

                      <button
                        className="icon-btn"
                        onClick={() => handleDeletePermanent(h.id)}
                        title="Delete permanently"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
