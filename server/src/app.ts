import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import ordersRouter from "./routes/orders";
import usersRouter from "./routes/users";
import menuItemsRouter from "./routes/MenuItems";
import locationRouter from "./routes/Location";
import categoryRouter from "./routes/category";
import multer from "multer"; // Import multer
import path from "path";

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // The folder where uploaded images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// MongoDB Connection
mongoose
  .connect(MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Set up routes
app.use("/orders", ordersRouter);
app.use("/auth", usersRouter);
app.use("/menu-item", menuItemsRouter); // You will handle image uploads in this route
app.use("/location", locationRouter);
app.use("/category", categoryRouter);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Café ordering backend is up and running!");
});

// Static folder to serve uploaded images
app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT as string;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
