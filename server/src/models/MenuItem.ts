import mongoose, { Document, Schema } from 'mongoose';
import CustomizationOption from './CustomizationOption';

interface MenuItem extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  basePrice: number;
  customizations: mongoose.Types.ObjectId[]; // Array of CustomizationOption references
}

const menuItemSchema = new Schema<MenuItem>({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  basePrice: { type: Number, required: true },
  customizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomizationOption' }]
});

const MenuItem = mongoose.model<MenuItem>('MenuItem', menuItemSchema);

export default MenuItem;
