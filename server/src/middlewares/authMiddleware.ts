// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  userId: string; // Adjust based on your actual payload structure
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('Token verification error:', error.message);
    res.status(error.name === 'TokenExpiredError' ? 401 : 403).json({
      message: error.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.',
    });
  }
};
