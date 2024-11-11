// category.model.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  name: string;
  description: string;
}

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

export default mongoose.model<Category>('Category', categorySchema);
