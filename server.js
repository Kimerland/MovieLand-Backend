import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import { uploadAvatar, deleteAvatar } from "./src/controllers/avatar.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { register, login } from "./src/controllers/register.js";
import { authMiddleware, getUserData } from "./src/middleware/login.js";
import dotenv from "dotenv";
import { getPhotos, getPhotoByName } from "./src/controllers/photos/photos.js";
import { getBackgroundImage } from "./src/controllers/photos/photos.js";

dotenv.config();

const DB_URL = process.env.DB_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
import fs from "fs";
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "uploads")));

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Routes
app.post("/api/register", register);
app.post("/api/login", login);
app.post(
  "/api/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);
app.delete("/api/avatar", authMiddleware, deleteAvatar);

app.get("/api/user", authMiddleware, getUserData);
app.get("/api/photos", getPhotos);
app.get("/api/photos/:name", getPhotoByName);

// new img

app.get("/api/images/:name", getBackgroundImage);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Connect to MongoDB
mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
