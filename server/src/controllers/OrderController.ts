import { Response, NextFunction } from "express";
import Order from "../models/Order";
import { AddOrderRequest, GetOrderRequest } from "../interfaces/orderRequests";

// Add a new order
export const addOrder = async (
  req: AddOrderRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    items,
    totalPrice,
    customerNotes,
    customerId,
    estimatedCompletionTime,
  } = req.body;

  if (!items || !totalPrice || !customerId) {
    return res
      .status(400)
      .json({ message: "Item, quantity, and price are required fields." });
  }
  try {
    const newOrder = new Order({
      items,
      totalPrice,
      customerNotes,
      customerId,
      estimatedCompletionTime,
    });
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return next(error);
  }
};

// Get all orders
export const getorders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};

export const getOrderById = async (
  req: GetOrderRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve order", error });
  }
};

export const getOrdersByUser = async (
  req: {
    params: {
      userId: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find({ customerId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};
