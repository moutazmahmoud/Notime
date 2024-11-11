import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  addCustomizationToMenuItem,
} from "../controllers/MenuItemController";
import { authToken } from "../middlewares/authToken";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { authorizeRole } from "../middlewares/authorizeRole";

const router = express.Router();

// Route to create a new menu item (only accessible by admins)
router.post("/create", createMenuItem);

// Route to get all menu items (can filter by category if provided)
router.get("/", getMenuItems);

// Route to get a specific menu item by ID
router.get("/:id", getMenuItemById);

// Route to update an existing menu item (only accessible by admins)
router.put("/:id", authToken, authorizeAdmin, updateMenuItem);

// Route to delete a menu item (only accessible by admins)
router.delete("/:id", authToken, authorizeAdmin, deleteMenuItem);

// Route to add a customization to a menu item (only accessible by admins)
router.post(
  "/add-customization",
  authToken,
  authorizeAdmin,
  addCustomizationToMenuItem
);

export default router;
