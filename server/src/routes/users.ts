// router file
import express, { Response, NextFunction } from 'express';
import { getAllUsers, loginUser, registerUser } from '../controllers/UserController';
import { authToken } from '../middlewares/authToken';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);


// Admin-only
router.get('/all', getAllUsers);


export default router;
