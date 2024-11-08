import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import Order from '../models/Order';

const orderController = require('../controllers/OrderController')

const router = Router();

// Get all orders
router.get('/all', orderController.getorders);

// Add the handler to the router
router.post('/new-order', orderController.addOrder);

export default router;
