// Item.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface Item extends Document {
  name: string;
  price: number;
  quantity: number;
  type: 'drink' | 'dessert' | 'other';
}

const itemSchema = new Schema<Item>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['drink', 'dessert', 'other'], required: true },
});

const ItemModel = mongoose.model<Item>('Item', itemSchema);
export default ItemModel;
