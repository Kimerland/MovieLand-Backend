import { resizeAvatar, generateDefaultAvatar } from "../utils/utils.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOAD_DIR = path.join(dirname(dirname(__dirname)), "uploads");

export async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    //const userId = req.user._id // Removed as per update 1
    console.log("Uploading avatar for user:", req.user._id);

    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    const resizedBuffer = await resizeAvatar(req.file.buffer);

    const filename = `${req.user._id}-${Date.now()}.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Delete old avatar if exists
    if (req.user.avatar) {
      const oldAvatarPath = path.join(
        UPLOAD_DIR,
        path.basename(req.user.avatar)
      );
      try {
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        console.error("Error deleting old avatar:", error);
      }
    }

    await fs.writeFile(filepath, resizedBuffer);

    const avatarPath = `/avatars/${filename}`;

    // Update user's avatar in the database
    req.user.avatar = avatarPath;
    await req.user.save();

    res.json({
      message: "Avatar uploaded successfully",
      avatar: avatarPath,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Error uploading avatar" });
  }
}

export async function deleteAvatar(req, res) {
  try {
    //const userId = req.user._id // Removed as per update 2
    console.log("Deleting avatar for user:", req.user._id);

    // Generate default avatar
    const defaultAvatar = await generateDefaultAvatar(req.user.email);
    const filename = `${req.user._id}-default.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filepath, defaultAvatar);

    const avatarPath = `/avatars/${filename}`;

    // Update user's avatar in the database
    req.user.avatar = avatarPath;
    await req.user.save();

    res.json({
      message: "Avatar reset to default",
      avatar: avatarPath,
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    res.status(500).json({ message: "Error deleting avatar" });
  }
}
