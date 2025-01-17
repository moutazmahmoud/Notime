// router file
import express, { Response, NextFunction } from "express";
import {
  editUser,
  getAllUsers,
  loginUser,
  registerUser,
  sendResetCode,
  setNewPasswordWithCode,
  toggleLikedMenuItem,
  validateResetCode,
} from "../controllers/UserController";
import { authToken } from "../middlewares/authToken";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { authorizeSelf } from "../middlewares/authorizeRole";

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser); // Login user

router.post("/reset-password", sendResetCode); // Send reset password email

router.post("/reset-password/validate", validateResetCode); // Validate reset code

router.post("/reset-password/set-new-password", setNewPasswordWithCode); // Set new password

router.put("/edit/:id", authToken, authorizeSelf(), editUser); // Update user details

router.delete("/:id", authToken, authorizeAdmin, editUser); // Delete user

router.post(
  "/:id/toggle-liked-item",
  authToken,
  authorizeSelf(),
  toggleLikedMenuItem
);

// Admin-only
router.get("/all", authToken, authorizeAdmin, getAllUsers);

export default router;
