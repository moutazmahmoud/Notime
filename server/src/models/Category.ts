import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  name: string;
  description: string;
}

const categorySchema = new Schema<Category>({
  name: { type: String, required: true },
  description: { type: String, default: '' }, // Default to an empty string if no description is provided
});

export default mongoose.model<Category>('Category', categorySchema);
