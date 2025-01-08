import mongoose, { Document, Schema } from "mongoose";

interface ICustomizationOption extends Document {
  itemType: string; // e.g., 'Drink', 'Dessert'
  name: string; // e.g., 'Milk Type', 'Topping'
  options: string[]; // e.g., ['Whole Milk', 'Soy Milk']
  priceAdjustment: number; // e.g., additional charge for a specific option
}

const customizationOptionSchema = new Schema<ICustomizationOption>({
  itemType: { type: String, required: true },
  name: { type: String, required: true },
  options: [{ type: String, required: true }],
  priceAdjustment: { type: Number, default: 0 },
});

export default mongoose.model<ICustomizationOption>(
  "CustomizationOption",
  customizationOptionSchema
);
