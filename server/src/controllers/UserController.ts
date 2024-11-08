import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'; // Import bcrypt for hashing

// Get all users (Admin-only functionality)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error });
  }
};


// Register new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role: 'customer', // default role
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Failed to register user', error });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Return user details on successful login
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authenticate user', error });
  }
};