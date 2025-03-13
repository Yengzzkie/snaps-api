import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// route for all photos
router.route("/").get((req, res) => {
  try {
    fs.readFile("data/photos.json", (err, data) => {
      const photos = JSON.parse(data);
      res.json(photos);
    });
  } catch (error) {
    console.error("Failed to get photos:", error);
    res.status(500).json({ message: "Failed to load photos" });
  }
});

// route for a single photo
router.get("/:id", (req, res) => {
  try {
    fs.readFile("data/photos.json", (err, data) => {
      const photos = JSON.parse(data);
      const photo = photos.find((photo) => photo.id === req.params.id); // filter the photos array by id
      if (!photo) {
        res.status(404).json({ message: "Photo not found" });
        return;
      }
      res.json(photo);
    });
  } catch (error) {
    console.error("Failed to get tag:", error);
    res.status(500).json({ message: "Failed to load tag" });
  }
});

// route for getting and posting comments on a photo
router
  .route("/:id/comments")
  .get((req, res) => {
    try {
      fs.readFile("data/photos.json", (err, data) => {
        const photos = JSON.parse(data);
        const photo = photos.find((photo) => photo.id === req.params.id); // filter the photos array by id
        if (!photo) {
          res.status(404).json({ message: "Photo not found" });
          return;
        }
        res.json(photo.comments);
      });
    } catch (error) {
      console.error("Failed to get tag:", error);
      res.status(500).json({ message: "Failed to load tag" });
    }
  })
  .post((req, res) => {
    const id = uuidv4();
    res.json({ message: "Post request submitted", id: id });
  });

export default router;
