import { Request, Response } from 'express';
import Item from '../models/Item';

// Add new Item (Admin)
export const addItem = async (req: Request, res: Response) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add Item', error });
  }
};

// Get all Items
export const getItems = async (req: Request, res: Response) => {
  try {
    const Items = await Item.find();
    res.status(200).json(Items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve Items', error });
  }
};
