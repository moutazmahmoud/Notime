import {
  Router,
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import Order from "../models/Order";
import { authToken } from "../middlewares/authToken";

const orderController = require("../controllers/OrderController");

const router = Router();

// Get all orders
router.get("/all", authToken, orderController.getorders);

// Get order by ID
router.get("/:orderId", authToken, orderController.getOrderById);

// Get orders by user ID
router.get("/user-orders/:userId", orderController.getOrdersByUser);

// Add the handler to the router
router.post("/new-order", orderController.addOrder);

export default router;
