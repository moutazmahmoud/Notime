import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AddOrderRequest, GetOrderRequest } from '../interfaces/orderRequests';

// Add a new order
export const addOrder = async (req: AddOrderRequest, res: Response, next: NextFunction) => {
  const { item, quantity, price, status } = req.body;

  if (!item || !quantity || !price) {
    return res.status(400).json({ message: "Item, quantity, and price are required fields." });
  }

  try {
    const newOrder = new Order({ item, quantity, price, status });
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return next(error);
  }
};

// Get all orders
export const getorders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
};
