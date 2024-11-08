import mongoose, { Document, Schema } from 'mongoose';
import { Item } from './Item';

interface Order extends Document {
  items: mongoose.Types.ObjectId[]; // References to Item documents
  totalPrice: number;
  customerNotes?: string;
}

const orderSchema = new Schema<Order>({
  items: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
  totalPrice: { type: Number, required: true },
  customerNotes: { type: String },
});

export default mongoose.model<Order>('Order', orderSchema);
