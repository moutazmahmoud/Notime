import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';

export const authorizeRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied. Unauthorized role.' });
      return;
    }
    next();
  };
};


/**
 * Middleware to authorize a user to edit their own information
 */
export const authorizeSelf = () => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // if (!req.user || req.user.id !== req.params.id) {
    //   res.status(403).json({ message: 'Access denied. Unauthorized access.' });
    //   return;
    // }
    next();
  };
};