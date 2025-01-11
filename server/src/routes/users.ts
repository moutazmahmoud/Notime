// router file
import express, { Response, NextFunction } from "express";
import {
  editUser,
  getAllUsers,
  loginUser,
  registerUser,
  toggleLikedMenuItem,
} from "../controllers/UserController";
import { authToken } from "../middlewares/authToken";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { authorizeSelf } from "../middlewares/authorizeRole";

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

router.put("/edit/:id", authorizeSelf(), editUser);

router.delete("/:id", authorizeSelf(), editUser);

router.post("/:id/toggle-liked-item", toggleLikedMenuItem);

// Admin-only
router.get("/all", authorizeAdmin, getAllUsers);

export default router;
