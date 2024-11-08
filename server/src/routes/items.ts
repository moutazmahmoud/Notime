import { Router, Request, Response } from 'express';
import Item from '../models/Item';

const router = Router();

// Get all Items
router.get('/all', async (req: Request, res: Response) => {
  const Items = await Item.find();
  res.json(Items);
});

// Create a new Item
router.post('/add-item', async (req: Request, res: Response) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

export default router;
