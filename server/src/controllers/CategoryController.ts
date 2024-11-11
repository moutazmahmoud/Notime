import { RequestHandler } from "express";
import Category from "../models/Category";

export const createCategory: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { name, description } = req.body;

  if (!name || typeof name !== "string") {
    res.status(400).json({ message: "Category name is required and must be a string." });
    return;
  }

  const trimmedName = name.trim().toLowerCase(); // Normalize the name

  try {
    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name: trimmedName });
    if (existingCategory) {
      res.status(409).json({ message: "Category with this name already exists." });
      return;
    }

    const newCategory = new Category({
      name: trimmedName,
      description: description?.trim() || "" // Trim description if it exists
    });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};
