# 🎬 MovieLand Backend  

![MovieLand Backend](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2lhdzRoNzhiYTdzNWYzbXV0ajM2NGY2MHBrcnFybTR2aHZ1NjNyaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NUwoRZzHc2Bws/giphy.gif)  

**MovieLand Backend** is a **Node.js + Express** server that powers the MovieLand platform. It provides **user authentication, movie data fetching, and AI-powered chat features**.

## 🚀 Live API  
🔗 [MovieLand Backend (Live)](https://movieland-backend.up.railway.app)  

[![GitHub stars](https://img.shields.io/github/stars/Kimerland/MovieLand-Backend?style=social)](https://github.com/Kimerland/MovieLand-Backend)  
[![GitHub issues](https://img.shields.io/github/issues/Kimerland/MovieLand-Backend)](https://github.com/Kimerland/MovieLand-Backend/issues)  
[![GitHub license](https://img.shields.io/github/license/Kimerland/MovieLand-Backend)](https://github.com/Kimerland/MovieLand-Backend/blob/main/LICENSE)  

---

## 📌 Tech Stack  
- 🚀 **Node.js + Express** – Fast and scalable backend  
- 🔐 **JWT & bcrypt** – Secure authentication  
- 🌍 **MongoDB & Mongoose** – NoSQL database  
- 🤖 **Hugging Face** – AI-powered chat assistant  
- 🎬 **OMDB API** – Movie data retrieval  
- 📦 **Multer & Sharp** – Image processing
---

## 📖 Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/Kimerland/MovieLand-Backend.git
cd MovieLand-Backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
Create a .env file in the root directory and add the following:
```bash
PORT=5000
DB_URL=your_key
SECRET_KEY=your_key
HUGGINGFACE_API_KEY=your_key
OMDB_API_KEY=your_key
YOUTUBE_API_KEY=your_key
```

### 4️⃣ Start the server
Development Mode
```bash
npm run dev
```

### The app will be available at:
🔗 http://localhost:5000

---

📡 API Endpoints
🔐 Authentication
```bash
POST /api/register – Register a new user
POST /api/login – Authenticate and get a token
GET /api/user – Get user details (requires authentication)
PUT /api/user – Update user data
```

🎬 Movies
```bash
GET /api/movies – Fetch movies from OMDB API
```

🤖 AI Chat
```bash
POST /api/chat – AI-powered chat assistant
```

---

🔗 https://movieland-backend.up.railway.app/

---
### 🛠 Additional Commands

📦 Build the project
```bash
npm run build
```

---
### 📢 Contact

```bash
👤 Author: Kimerland
📧 Email: kimerland.project@gmail.com
🐙 GitHub: Kimerland
```

---

### ⭐️ If you like this project, please give it a star!
