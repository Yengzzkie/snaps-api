import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import tagsRoute from './routes/tags.js';
import photosRoute from './routes/photos.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors())

// tags route
app.use("/tags", tagsRoute);

// photos route
app.use("/photos", photosRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});