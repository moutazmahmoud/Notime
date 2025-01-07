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

// Add the handler to the router
router.post("/new-order", authToken, orderController.addOrder);

export default router;
