import sharp from "sharp";
import { createCanvas } from "canvas";

export async function resizeAvatar(buffer) {
  return sharp(buffer)
    .resize(1000, 1000, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

export function generateDefaultAvatar(email) {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  // Blue background
  ctx.fillStyle = "#2196f3";
  ctx.fillRect(0, 0, 200, 200);

  // White text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Get first two letters of email
  const initials = email.split("@")[0].substring(0, 2).toUpperCase();

  ctx.fillText(initials, 100, 100);

  return canvas.toBuffer("image/jpeg");
}
