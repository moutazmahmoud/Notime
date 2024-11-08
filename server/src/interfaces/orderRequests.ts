import { Request } from 'express';

export interface AddOrderRequest extends Request {
  body: {
    item: string;
    quantity: number;
    price: number;
    status?: string;
  };
}

export interface GetOrderRequest extends Request {
  params: {
    orderId: string;
  };
}
