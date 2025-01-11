import mongoose, { Document, Schema } from "mongoose";

interface OrderItem {
  item: mongoose.Types.ObjectId; // Reference to the MenuItem model
  quantity: number; // Quantity of the menu item
}

interface Order extends Document {
  items: OrderItem[];
  totalPrice: number;
  customerNotes?: string;
  status:
    | "pending"
    | "accepted"
    | "in progress"
    | "ready for pickup"
    | "completed"
    | "cancelled";
  customerId: mongoose.Types.ObjectId;
  orderDate: Date;
  preferredPickupTime?: Date; // Optional field for preferred pickup time
  cancelReason?: string; // Reason for cancellation if the status is "cancelled"
  estimatedCompletionTime?: Date; // New field for estimated completion time
}

const orderSchema = new Schema<Order>(
  {
    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    customerNotes: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in progress",
        "ready for pickup",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderDate: { type: Date, default: Date.now, required: true },
    preferredPickupTime: { type: Date }, // Optional preferred pickup time
    cancelReason: { type: String }, // Optional cancel reason
    estimatedCompletionTime: { type: Date }, // New field for estimated completion time
  },
  { timestamps: true } // Enable timestamps for createdAt and updatedAt
);

export default mongoose.model<Order>("Order", orderSchema);
