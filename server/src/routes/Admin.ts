
import express from 'express';
import { getAllUsers, loginUser, registerUser } from '../controllers/UserController';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);


// Admin-only
router.get('/all', getAllUsers);

export default router;