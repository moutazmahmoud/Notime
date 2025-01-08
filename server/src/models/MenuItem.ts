import mongoose, { Document, Schema } from "mongoose";
import CustomizationOption from "./CustomizationOption";

interface MenuItem extends Document {
  name: string;
  category: {
    id: mongoose.Types.ObjectId; // Reference to the Category model
    name: string; // Name of the category
  };
  basePrice: number;
  customizations: mongoose.Types.ObjectId[]; // Array of CustomizationOption references
  image: string;
}

const menuItemSchema = new Schema<MenuItem>({
  name: { type: String, required: true, unique: true },
  category: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true }, // Embedded category name
  },
  basePrice: { type: Number, required: true },
  image: { type: String },
  customizations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomizationOption", // Adjusted for consistency
    },
  ],
});

// Pre-save hook to ensure category name is always up-to-date
menuItemSchema.pre("save", async function (next) {
  if (this.isModified("category.id")) {
    const Category = mongoose.model("Category");
    const category = await Category.findById(this.category.id);
    if (!category) {
      return next(new Error("Category not found"));
    }
    this.category.name = category.name;
  }
  next();
});

export default mongoose.model<MenuItem>("MenuItem", menuItemSchema);
