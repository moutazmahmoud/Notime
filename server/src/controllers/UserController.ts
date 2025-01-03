import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt"; // Import bcrypt for hashing
import jwt from "jsonwebtoken"; // Import jwt for token generation

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
  const { username, password, email } = req.body;

  // Validate request body
  if (!username || !email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({ message: "User already exists" });
    return;
  }
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role: "customer", // default role
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Failed to register user", error });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // End the function early to avoid further code execution
    }

    // Check if password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Send the response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate user", error });
  }
};
