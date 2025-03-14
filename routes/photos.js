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
    console.error("Failed to load photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// route for getting comments on a photo
router.route("/:id/comments")
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
      console.error("Failed to get comments:", error);
      res.status(500).json({ message: "Failed to get comments" });
    }
  })
  // route to post comments on a photo
  .post((req, res) => {
    try {
      const requestData = req.body;
      const { name, comment } = requestData;

      if (!name || !comment) { // return an error if the input fields are empty
        res.status(400).json({ message: "Bad request, input fields cannot be empty" });
        return;
      }

      if (name.length < 3 || comment.length < 3) { // return an error if comment is less than 3 characters
        res.status(400).json({ message: "Name or comment too short" });
        return;
      }

      fs.readFile("data/photos.json", (err, data) => {
        const photos = JSON.parse(data);
        const photo = photos.find((photo) => photo.id === req.params.id); // find the photo first based on the id params
        const id = uuidv4(); // generate new ID
        const timestamp = new Date().getTime(); // generate new date in milliseconds

        if (!photo) { // if photo doesn't exist return a 404 error just in case user messes with the id params in post request
          res.status(404).json({ message: "Photo not found" });
          return;
        }

        const newComment = { ...requestData, id: id, timestamp: timestamp }; // construct the new comment and add the id and timestamp
        photo.comments.push(newComment); // push it to the comments array of the specific photo

        fs.writeFile("data/photos.json", JSON.stringify(photos), () => { // update the existing json file with the newly created comment
          res.status(201).json(newComment);
        });
      });
    } catch (error) {
      console.error("Failed to post comment:", error);
      res.status(500).json({ message: "Internal server error" })
    }
  });

export default router;