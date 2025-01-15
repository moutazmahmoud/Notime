// authMiddleware.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  AuthenticatedRequest,
  UserPayload,
} from "../interfaces/AuthenticatedRequest";

export const authToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    res.status(error.name === "TokenExpiredError" ? 401 : 403).json({
      message:
        error.name === "TokenExpiredError"
          ? "Token expired."
          : "Invalid token.",
    });
  }
};
