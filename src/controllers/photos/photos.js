import path from "path";
import fs from "fs";

const photosPath = path.join(process.cwd(), "uploads", "photos");

if (!fs.existsSync(photosPath)) {
  fs.mkdirSync(photosPath, { recursive: true });
}

export const getPhotos = (req, res) => {
  fs.readdir(photosPath, (err, files) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(files);
  });
};

export const getPhotoByName = (req, res) => {
  const photoName = req.params.name;
  const filePath = path.join(photosPath, photoName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "Photo not founded" });
  }
};
