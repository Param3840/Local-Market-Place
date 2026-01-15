import { useEffect, useRef, useState } from "react";
import api from "../../api"; // ✅ centralized API
import "./SellerPage.css";

export default function AddProductModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [imageData, setImageData] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleImageClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageData(null);
    if (fileRef.current) fileRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Please enter a product name.");
    if (!category.trim()) return alert("Please enter a product category.");

    const sellerId = localStorage.getItem("user_id");
    if (!sellerId) return alert("Seller ID missing. Please login again.");

    const payload = {
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      category: category.trim(),
      description: description.trim(),
      image: imageData || "",
      sellDate: sellDate ? new Date(sellDate).toISOString() : "",
      sellerId,
    };

    console.log("📦 Sending payload:", payload);

    try {
      const res = await api.post("/products/add", payload);
      if (res.status === 200 || res.status === 201) {
        onAdd(res.data);
        onClose();
      } else {
        console.error("❌ Server responded with error:", res.data);
        alert(res.data.error || "Failed to add product");
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      alert("Something went wrong. Check your connection or server logs.");
    }

    // Reset form
    setName("");
    setPrice("");
    setStock(1);
    setCategory("");
    setDescription("");
    setSellDate("");
    setImageData(null);
    if (fileRef.current) fileRef.current.value = null;
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target.classList.contains("modal-backdrop")) onClose();
      }}
    >
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()} role="document">
        <header className="modal-header">
          <h3>Add Product</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✖</button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-grid">
            <label className="field" aria-label="Product image">
              <span>Product Image</span>
              <div className="image-uploader">
                <div className="image-placeholder" onClick={handleImageClick}>
                  {imageData ? (
                    <img src={imageData} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="no-image">No image</div>
                  )}
                </div>
                <div className="image-controls">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button type="button" className="small-btn" onClick={handleImageClick}>Upload</button>
                  <button type="button" className="small-btn secondary" onClick={handleRemoveImage}>Remove</button>
                </div>
              </div>
            </label>

            <label className="field">
              <span>Product Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Headphones"
                required
              />
            </label>

            <label className="field">
              <span>Price (₹)</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </label>

            <label className="field">
              <span>Stock Quantity</span>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" />
            </label>

            <label className="field">
              <span>Category</span>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Electronics" />
            </label>

            <label className="field">
              <span>Sell Date (optional)</span>
              <input type="datetime-local" value={sellDate} onChange={(e) => setSellDate(e.target.value)} />
            </label>

            <label className="field full">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                rows="3"
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={!name.trim()}>Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
