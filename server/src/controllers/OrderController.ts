import { Response, NextFunction } from "express";
import Order from "../models/Order";
import {
  AddOrderRequest,
  GetOrderRequest,
  UpdateOrderRequest,
  updateOrderStatusRequest,
} from "../interfaces/orderRequests";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest";

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
    res
      .status(400)
      .json({ message: "Item, quantity, and price are required fields." });
    return;
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
    res.status(201).json(newOrder);
    return;
  } catch (error) {
    return next(error);
  }
};

export const getorders = async (
  // Get all orders
  req: AuthenticatedRequest,
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

export const updateOrderStatus = async (
  req: updateOrderStatusRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, {
      status: req.body.status,
    });

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

export const updateOrder = async (
  req: UpdateOrderRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, {
      items: req.body.items,
      status: req.body.status,
      customerNotes: req.body.customerNotes,
      estimatedCompletionTime: req.body.estimatedCompletionTime,
      totalPrice: req.body.totalPrice,
      customerId: req.body.customerId,
      preferredPickupTime: req.body.preferredPickupTime,
      cancelReason: req.body.cancelReason,
      orderDate: req.body.orderDate,
    });

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};
