import mongoose, { Document, Schema } from "mongoose";

interface Order extends Document {
  items: Array<{
    item: mongoose.Types.ObjectId; // Reference to the MenuItem model
    quantity: number; // Quantity of the menu item
  }>;
  totalPrice: number;
  customerNotes?: string;
}

const orderSchema = new Schema<Order>({
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
      quantity: { type: Number, required: true, default: 1 }, // Default quantity is 1
    },
  ],
  totalPrice: { type: Number, required: true },
  customerNotes: { type: String, default: '' }, // Optional notes from the customer
});

export default mongoose.model<Order>("Order", orderSchema);
