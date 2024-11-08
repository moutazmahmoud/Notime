import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders';
import usersRouter from './routes/users';
import itemsRouter from './routes/items';

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;
// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(MONGO_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Café ordering backend is up and running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

