import { RequestHandler } from "express";
import MenuItem from "../models/MenuItem";
import Category from "../models/Category";
import mongoose from "mongoose";
import CustomizationOption from "../models/CustomizationOption";
import multer from "multer";
import path from "path";
import * as fs from "fs";

// Helper function to parse and validate customizations
const parseCustomizations = (customizations: string): string[] => {
  let parsedCustomizations: string[] = [];

  if (!customizations || customizations.trim() === "") {
    return [];
  }

  try {
    parsedCustomizations = JSON.parse(customizations);

    if (!Array.isArray(parsedCustomizations)) {
      throw new Error("Customizations must be an array.");
    }

    parsedCustomizations.forEach((id) => {
      if (!isValidObjectId(id)) {
        throw new Error(`Invalid customization ID: ${id}`);
      }
    });

    return parsedCustomizations;
  } catch (error) {
    throw new Error(
      `Invalid customizations format. ${"Must be a JSON array of valid IDs."}`
    );
  }
};

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create directory if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Create a new menu item
export const createMenuItem: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { name, category, basePrice, customizations, description } = req.body;
  const image = req.file; // Use multer's file handling

  // Validate required fields
  if (!name || !category || !basePrice) {
    console.error("Step 3: Missing required fields");
    res.status(400).json({
      message: "'name', 'category', and 'basePrice' are required.",
    });
    return;
  }

  try {
    // Find or create category based on the name

    let foundCategory = await Category.findOne({ name: category });

    if (!foundCategory) {
      foundCategory = new Category({
        name: category,
        description: "", // Modify if needed
      });
      await foundCategory.save();
    }

    // Handle image URL (only if image is present)
    let imageUrl = "";
    if (image) {
      imageUrl = `/uploads/${image.filename}`;
    }

    let parsedCustomizations = parseCustomizations(customizations);
    try {
      // If customizations is empty or not provided, default to an empty array
      if (customizations === "" || !customizations) {
        parsedCustomizations = [];
      } else {
        // Try parsing customizations if provided
        parsedCustomizations = JSON.parse(customizations);
      }

      // Check if it's an array
      if (!Array.isArray(parsedCustomizations)) {
        console.error(
          "Step 12: Customizations are not an array:",
          parsedCustomizations
        );
        res.status(400).json({
          message: "Customizations must be a valid JSON array.",
        });
        return;
      }
    } catch (parseError) {
      console.error("Step 13: Error parsing customizations:", parseError);
      res.status(400).json({
        message: "Invalid customizations format. Must be a valid JSON array.",
      });
      return;
    }

    // Validate customization ObjectId if required
    const customizationIds = parsedCustomizations.map((id: string) => {
      if (!isValidObjectId(id)) {
        console.error("Step 14: Invalid ObjectId in customizations:", id);
        throw new Error(`Invalid customization ID: ${id}`);
      }
      return id;
    });

    // Create the new menu item
    const newMenuItem = new MenuItem({
      name,
      description,
      category: {
        id: foundCategory._id,
        name: foundCategory.name,
      },
      basePrice,
      customizations: customizationIds,
      image: imageUrl, // Save image URL to menu item (empty string if no image)
    });

    // Save menu item to database
    await newMenuItem.save();

    // Respond with the created menu item
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("Step 15: Error creating menu item:", error);
    next(error);
  }
};

// Get all MenuItems with optional category filter
export const getMenuItems: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { category } = req.query;

  try {
    const query = category ? { "category.name": category as string } : {};
    const menuItems = await MenuItem.find(query).populate({
      path: "customizations",
      model: CustomizationOption,
    });

    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    next(error);
  }
};

// Get a single MenuItem by ID
export const getMenuItemById: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid menu item ID." });
    return;
  }

  try {
    const menuItem = await MenuItem.findById(id).populate({
      path: "customizations",
      model: CustomizationOption,
    });

    if (!menuItem) {
      res.status(404).json({ message: "Menu item not found." });
      return;
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item by ID:", error);
    next(error);
  }
};

// Update MenuItem (with image upload)
export const updateMenuItem: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { id } = req.params;
  const { name, categoryName, basePrice, customizations, description } =
    req.body;
  const image = req.file; // The uploaded image file (if any)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid menu item ID." });
    return;
  }

  try {
    let parsedCustomizations = parseCustomizations(customizations);

    // If categoryName is provided, find the corresponding Category document
    let foundCategory = null;
    if (categoryName) {
      foundCategory = await Category.findOne({ name: categoryName });

      if (!foundCategory) {
        // Create the category if it doesn't exist
        foundCategory = new Category({ name: categoryName, description: "" });
        await foundCategory.save();
      }
    }

    const updatedData: any = {
      name,
      category: foundCategory
        ? { id: foundCategory._id, name: foundCategory.name }
        : undefined,
      basePrice,
      description,
      customizations: parsedCustomizations,
    };

    // If a new image is uploaded, add it to the updated data
    if (image) {
      updatedData.image = `/uploads/${image.filename}`; // Save the new image URL
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenuItem) {
      res.status(404).json({ message: "Menu item not found." });
      return;
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    next(error);
  }
};

// Delete MenuItem
export const deleteMenuItem: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid menu item ID." });
    return;
  }

  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      res.status(404).json({ message: "Menu item not found." });
      return;
    }

    res.status(200).json({ message: "Menu item deleted successfully." });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    next(error);
  }
};
