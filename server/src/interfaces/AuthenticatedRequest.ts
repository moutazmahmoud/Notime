import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface UserPayload extends JwtPayload {
  userId: string;
  role: string;
  email: string;
}
