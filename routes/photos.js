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
        const photo = photos.find((photo) => photo.id === req.params.id); // find the photos array by id
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
    try {
      const requestData = req.body;
      const id = uuidv4(); // generate new ID
      const timestamp = new Date().getTime(); // generate new date in milliseconds

      fs.readFile("data/photos.json", (err, data) => {
        const photos = JSON.parse(data);
        const photo = photos.find((photo) => photo.id === req.params.id); // find the photo first based on the id params
        
        if (!photo) { // if photo doesn't exist return a 404 error just in case user messes with the id params in post request
          res.status(404).json({ message: "Photo not found" });
          return;
        }

        const newComment = { ...requestData, id: id, timestamp: timestamp }; // construct the new comment
        photo.comments.push(newComment); // push it to the comments array of the specific photo

        fs.writeFile("data/photos.json", JSON.stringify(photos), () => { // update the existing json file with the newly created comment
          res.status(201).json({ message: "Comment posted successfully" });
        });
      });
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  });

export default router;
