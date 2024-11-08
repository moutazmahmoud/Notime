import { Item } from './Item';
import mongoose, { Document, Schema } from 'mongoose';

interface Dessert extends Item {
    toppings?: string[];
    servingStyle?: 'hot' | 'cold';
  }
  
  const dessertSchema = new Schema<Dessert>({
    toppings: { type: [String] },
    servingStyle: { type: String, enum: ['hot', 'cold'] },
  });
  
  export default mongoose.model<Dessert>('Dessert', dessertSchema);
  