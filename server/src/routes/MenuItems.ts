import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/MenuItemController";
import { authToken } from "../middlewares/authToken";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { authorizeRole } from "../middlewares/authorizeRole";
import multer from "multer";
import path from "path";

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where uploaded images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

// Route to create a new menu item (only accessible by admins)
router.post("/create", upload.single("image"), createMenuItem); // Use multer middleware here

// Route to get all menu items (can filter by category if provided)
router.get("/", getMenuItems);

// Route to get a specific menu item by ID
router.get("/:id", getMenuItemById);

// Route to update an existing menu item (only accessible by admins)
router.put("/:id", upload.single("image"), updateMenuItem); // Use multer middleware here

// Route to delete a menu item (only accessible by admins)
router.delete("/:id", deleteMenuItem);


export default router;
