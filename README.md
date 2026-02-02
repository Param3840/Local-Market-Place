# 🛍️ Local Market Place

Welcome to **Local Market Place** — a full-stack web application that connects buyers and sellers in a seamless online marketplace. Built with ❤️ using the MERN stack (MongoDB, Express, React, Node.js), this project is designed to simplify local commerce with real-time chat, product listings, cart management, and secure authentication.

---

## 🚀 Live Deployments

| Layer     | URL                                                                 |
|-----------|----------------------------------------------------------------------|
| 🌐 Frontend | [local-market-place-ten.vercel.app](https://local-market-place-ten.vercel.app) |
| 🔧 Backend  | [local-market-place.onrender.com](https://local-market-place.onrender.com)       |

---

## 🧩 Tech Stack

- **Frontend**: React, React Router, Axios, CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, Cookies
- **Real-time Chat**: Socket.IO
- **File Uploads**: Multer
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📦 Features

### 👤 Authentication
- Buyer & Seller signup/login
- JWT-based secure sessions
- Role-based routing

### 🛒 Marketplace
- Product listing & browsing
- Add to cart & wishlist
- Buyer-seller interaction

### 💬 Chat System
- Real-time messaging via Socket.IO
- Media sharing (images, files)
- Room-based conversations

### 📁 Media Uploads
- File upload via Multer
- Static file serving from backend

---

## 🧪 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/Param3840/Local-Market-Place.git
cd Local-Market-Place

# Install backend dependencies
cd backend
npm install
npm start

# Install frontend dependencies
cd ../frontend
npm install
npm run dev
