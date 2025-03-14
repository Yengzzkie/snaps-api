import express from "express";
import fs from "fs";

const router = express.Router();

// route to get tags
router.get("/", (req, res) => {
  try {
    fs.readFile("data/tags.json", (err, data) => {
      const tags = JSON.parse(data);
      res.json(tags);
    });
  } catch (error) {
    console.error("Failed to get tags:", error);
    res.status(500).json({ message: "Failed to load tags" });
  }
});

export default router;
