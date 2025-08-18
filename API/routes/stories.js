import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join("uploads", "stories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // save to uploads/stories
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getStories);
router.post("/", upload.single("image"), addStory); // <-- must match frontend
router.delete("/:id", deleteStory);

export default router;
