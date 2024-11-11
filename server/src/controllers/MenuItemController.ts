import { RequestHandler } from 'express';
import MenuItem from '../models/MenuItem';
import CustomizationOption from '../models/CustomizationOption';

// Create a new MenuItem
export const createMenuItem: RequestHandler = async (req, res, next): Promise<void> => {
  const { name, category, basePrice, customizations } = req.body;

  if (!name || !category || typeof basePrice !== 'number') {
    res.status(400).json({ message: 'Name, category, and base price are required fields.' });
    return;
  }

  try {
    const newMenuItem = new MenuItem({
      name,
      category,
      basePrice,
      customizations, // Array of ObjectIds
    });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    next(error);
  }
};

// Get all MenuItems with optional category filter
export const getMenuItems: RequestHandler = async (req, res, next): Promise<void> => {
  const { category } = req.query;

  try {
    const query = category ? { category } : {};  // Optional filtering by category
    const menuItems = await MenuItem.find(query).populate('customizations');
    res.status(200).json(menuItems);
  } catch (error) {
    next(error);
  }
};

// Get a single MenuItem by ID
export const getMenuItemById: RequestHandler = async (req, res, next): Promise<void> => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findById(id).populate('customizations');
    if (!menuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.status(200).json(menuItem);
  } catch (error) {
    next(error);
  }
};

// Update a MenuItem
export const updateMenuItem: RequestHandler = async (req, res, next): Promise<void> => {
  const { id } = req.params;
  const { name, category, basePrice, customizations } = req.body;

  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, category, basePrice, customizations },
      { new: true, runValidators: true } // Return updated document with validation
    );
    if (!updatedMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

// Delete a MenuItem
export const deleteMenuItem: RequestHandler = async (req, res, next): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add a new CustomizationOption to a MenuItem
export const addCustomizationToMenuItem: RequestHandler = async (req, res, next): Promise<void> => {
  const { menuItemId, customizationId } = req.body;

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }

    // Check if customization already exists for this item
    if (menuItem.customizations.includes(customizationId)) {
      res.status(400).json({ message: 'Customization already added' });
      return;
    }

    menuItem.customizations.push(customizationId);
    await menuItem.save();
    res.status(200).json(menuItem);
  } catch (error) {
    next(error);
  }
};
