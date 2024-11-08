// router file
import express, { Response, NextFunction } from 'express';
import { loginUser, registerUser } from '../controllers/UserController'; // Adjust based on your structure
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
// router.post('/login', loginUser);

// Route to get user info (requires authentication)
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    // Access req.user here since req is now typed as AuthenticatedRequest
    // Logic to get user details
    res.status(200).json({ message: 'User info retrieved successfully', user: req.user });
});

export default router;
