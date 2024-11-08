import { Item } from './Item';
import mongoose, { Document, Schema } from 'mongoose';

interface Drink extends Item {
    size: 'small' | 'medium' | 'large';
    milkPreference?: 'whole' | 'skim' | 'almond' | 'soy';
    extras?: string[];
}

const drinkSchema = new Schema<Drink>({
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    milkPreference: { type: String },
    extras: { type: [String] },
});

export default mongoose.model<Drink>('Drink', drinkSchema);
