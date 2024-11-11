import mongoose, { Document, Schema } from 'mongoose';

interface CustomizationOption extends Document {
  itemType: string; // e.g., 'Drink', 'Dessert'
  name: string; // e.g., 'Milk Type', 'Topping'
  options: string[]; // e.g., ['Whole Milk', 'Soy Milk']
  priceAdjustment: number; // e.g., additional charge for a specific option
}

const customizationOptionSchema = new Schema<CustomizationOption>({
  itemType: { type: String, required: true },
  name: { type: String, required: true },
  options: [{ type: String, required: true }],
  priceAdjustment: { type: Number, default: 0 }
});

const CustomizationOption = mongoose.model<CustomizationOption>('CustomizationOption', customizationOptionSchema);

export default CustomizationOption;
