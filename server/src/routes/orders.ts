import {
  Router,
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import Order from "../models/Order";
import { authToken } from "../middlewares/authToken";
import {
  addOrder,
  getOrderById,
  getorders,
  getOrdersByUser,
  updateOrder,
  updateOrderStatus,
} from "../controllers/OrderController";

const router = Router();

// Get all orders
router.get("/all", authToken, getorders);

// Get order by ID
router.get("/:orderId", authToken, getOrderById);

// Get orders by user ID
router.get("/user-orders/:userId", getOrdersByUser);

router.put("/order/status/:orderId", authToken, updateOrderStatus);

router.put("/order/:orderId", authToken, updateOrder);

// Add the handler to the router
router.post("/new-order", authToken, addOrder);

export default router;
