import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all users (Admin-only functionality)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users", error });
  }
};

// Register new user
export const registerUser: RequestHandler = async (req, res) => {
  const { username, password, email, phonenumber } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({ message: "User already exists" });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phonenumber,
      role: "customer",
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Failed to register user", error });
  }
};

// Login user
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        systemAvatar: user.systemAvatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate user", error });
  }
};

// Update user details
export const editUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Prevent updating password directly through this route
    if (updates.password) {
      res
        .status(400)
        .json({ message: "Use the change password route to update passwords" });
      return;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// Delete user
export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

// Change password
export const changePassword: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res
      .status(400)
      .json({ message: "Both old and new passwords are required" });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Old password is incorrect" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error });
  }
};

// Get user by ID
export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user", error });
  }
};

// Additional Controllers to Consider:
// - Reset Password: Generate a token and send it to the user's email for resetting the password.
// - Promote User Role: Allow admin to promote/demote user roles (e.g., "customer" to "admin").
// - Deactivate User: Temporarily disable a user's account instead of deleting it.

export const toggleLikedMenuItem: RequestHandler = async (req, res) => {
  const { menuItemId } = req.body as { menuItemId: string };
  const { id } = req.params;
  console.log("toggleLikedMenuItem:", id);

  try {
    // Validate input
    if (!menuItemId) {
      res.status(400).json({ message: "Menu item ID is required" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Ensure likedMenuItems exists as an array
    user.likedMenuItems = user.likedMenuItems || [];
    const isMenuItemLiked = user.likedMenuItems.includes(menuItemId);

    if (isMenuItemLiked) {
      // Remove the menu item from likedMenuItems
      user.likedMenuItems = user.likedMenuItems.filter(
        (itemId) => itemId.toString() !== menuItemId
      );

      await user.save();
      console.log("Menu item unliked:", user.likedMenuItems);
      res.status(200).json({
        message: "Menu item unliked",
        likedMenuItems: user.likedMenuItems,
      });
    } else {
      // Add the menu item to likedMenuItems
      user.likedMenuItems.push(menuItemId);
      await user.save();
      console.log("Menu item liked:", user.likedMenuItems);
      res.status(200).json({
        message: "Menu item liked",
        likedMenuItems: user.likedMenuItems,
      });
    }
  } catch (error) {
    console.error("Error toggling liked menu item:", error);
    res.status(500).json({
      message: "Failed to toggle liked menu item",
    });
  }
};
