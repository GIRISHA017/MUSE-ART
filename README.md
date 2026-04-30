# 🎨 MuseArt - Online Art Gallery & Auction Platform

MuseArt is a full-stack web application that connects **artists** and **art collectors** through a premium digital gallery and real-time auction system.

It enables:
- Artists to showcase and sell artwork  
- Collectors to browse, bid, and purchase  
- Admins to manage the marketplace  

---

## 🚀 Features

### 👤 User Roles

**Collector**
- Browse artworks  
- Participate in live auctions  
- Purchase artworks  
- Manage private vault  
- Resell owned artworks  

**Artist**
- Upload artwork  
- Create auction or fixed-price listings  
- Track live bids  
- View analytics  

**Admin**
- Manage artworks  
- Control auction status  
- Monitor platform activity  

---

## 🖼️ Core Functionalities

- Real-time auction system with countdown timers  
- Razorpay payment integration  
- JWT-based authentication  
- Role-based access control  
- Artist analytics dashboard  
- Curated galleries (Masters, Modern, Emerging)  
- Private vault for collectors  
- Artwork resell system  
- Automated auction scheduler (cron jobs)  

---

## 🏗️ Tech Stack

### Frontend
- React.js  
- Vite  
- Tailwind CSS  
- Framer Motion  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### Tools & Libraries
- Razorpay  
- JWT  
- bcryptjs  
- node-cron  



## 📂 Project Structure

MuseArt/
│
├── Backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── db/
│ ├── server.js
│ └── scheduler.js
│
├── src/
│ ├── Components/
│ ├── User/
│ ├── Admin/
│ ├── Artist/
│ └── App.jsx
│
└── package.json


---

## 🔄 Application Flow

1. User registers/logs in (Collector / Artist / Admin)  
2. Browse artworks  
3. Bid or purchase artwork  
4. Payment via Razorpay  
5. Artwork added to user vault  
6. Optional resale  

---

## 🔌 API Endpoints

### Authentication
- POST /api/auth/register  
- POST /api/auth/login  

### Gallery
- GET /api/gallery/artworks  
- POST /api/gallery/bid  
- POST /api/gallery/acquire  

### Payment
- POST /api/gallery/create-order  
- POST /api/gallery/verify-payment  

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)  
- MongoDB  
- Razorpay account (optional)  

### Steps

```bash
git clone https://github.com/your-username/museart.git
cd museart
npm install
npm run dev
Database Design
Entities
User
Artwork
Bid (Embedded)
Relationships
User creates Artwork
User owns Artwork
Users place bids on Artwork
🧠 Architecture
MVC Architecture
REST API Design
Single Page Application (SPA)
Decoupled frontend & backend
📈 Future Improvements
AI-based recommendations
Real-time bidding with WebSockets
Mobile application
NFT integration
🏁 Conclusion

MuseArt is a complete full-stack platform combining modern UI, secure backend, and real-time auction functionality. It creates a seamless digital marketplace for artists and collectors.

👥 Contributors
Varshini Akkisetti
Tejaswi Chenna
Senisetty Harshini
Poojitha
Girisha Varshini

