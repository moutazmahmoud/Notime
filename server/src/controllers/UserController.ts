import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/nodemailer";
import crypto from "crypto";

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
      { expiresIn: "2h" }
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

export const toggleLikedMenuItem: RequestHandler = async (req, res) => {
  const { menuItemId } = req.body as { menuItemId: string };
  const { id } = req.params;
  

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
      
      res.status(200).json({
        message: "Menu item unliked",
        likedMenuItems: user.likedMenuItems,
      });
    } else {
      // Add the menu item to likedMenuItems
      user.likedMenuItems.push(menuItemId);
      await user.save();
      
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

export const sendResetCode: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate a 4-digit reset code
    const resetCode = crypto.randomInt(1000, 9999).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    // Simulate email sending (replace with an email service)
    
    sendEmail(email, "Reset Password", `Reset code: ${resetCode}`);

    res.status(200).json({ message: "Reset code sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reset code.", error });
  }
};

export const validateResetCode: RequestHandler = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found." });
      return;
    }

    // Validate reset code and expiry
    if (!user.resetCode || user.resetCode !== resetCode) {
      res.status(400).json({ message: "Invalid or expired reset code." });
      return;
    }

    if (user.resetCodeExpiry && new Date() > user.resetCodeExpiry) {
      res
        .status(400)
        .json({ message: "Reset code has expired. Please request a new one." });
      return;
    }

    // Success response
    res.status(200).json({ message: "Reset code is valid." });
    return;
  } catch (error) {
    console.error("Error validating reset code:", error);
    res.status(500).json({ message: "Failed to validate reset code.", error });
    return;
  }
};

export const setNewPasswordWithCode: RequestHandler = async (req, res) => {
  const { email, newPassword, resetCode } = req.body;

  

  // // Validate the new password (e.g., minimum length, complexity)
  // if (!newPassword ) {
  //   
  //   res
  //     .status(400)
  //     .json({ message: "Password must be at least 8 characters long." });
  //   return;
  // }
  

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      
      res.status(404).json({ message: "User not found." });
      return;
    }
    

    if (!user.resetCode) {
      
      res
        .status(400)
        .json({ message: "Reset code not requested or already used." });
      return;
    }
    

    if (user.resetCode !== resetCode) {
      
      res
        .status(400)
        .json({ message: "Invalid reset code. Please check and try again." });
      return;
    }
    

    // Safely check if resetCodeExpiry exists before comparing it
    if (user.resetCodeExpiry && user.resetCodeExpiry < new Date()) {
      
      res
        .status(400)
        .json({ message: "Reset code has expired. Please request a new one." });
      return;
    }
    

    // Hash the new password
    
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 10);
      
    } catch (hashError) {
      console.error("Error hashing the password for user:", email, hashError);
      res
        .status(500)
        .json({ message: "Error hashing the password.", error: hashError });
      return;
    }

    // Update user password and clear reset fields
    
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Failed to update password for user:", email, error);
    res.status(500).json({ message: "Failed to update password.", error });
  }
};
