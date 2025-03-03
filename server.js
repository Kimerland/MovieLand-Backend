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
import {
  getPhotos,
  getPhotoByName,
  getBackgroundImage,
} from "./src/controllers/photos/photos.js";
import chatRoutes from "./src/api/chat.js";
import fs from "fs";
import movieRoutes from "./src/api/movies.js";
import { updateUser } from "./src/middleware/login.js";

dotenv.config();

const DB_URL = process.env.DB_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.get("/api/images/:name", getBackgroundImage);

// app put

app.put("/api/user", authMiddleware, updateUser);

// Chat routes
app.use("/api/chat", chatRoutes);
app.use("/api/movies", movieRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", details: err.message });
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
