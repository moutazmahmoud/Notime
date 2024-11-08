

import mongoose, { Document, Schema } from 'mongoose';

interface UserDocument extends Document {
  username: string;
  password: string; // Store hashed password
  email: string;
  role: 'admin' | 'customer'; // Define user roles
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
}, { timestamps: true });

export default mongoose.model<UserDocument>('User', UserSchema);
