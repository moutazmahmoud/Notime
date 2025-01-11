import { Request } from "express";

export interface AddOrderRequest extends Request {
  body: {
    items: { item: string; quantity: number }[];
    totalPrice: number;
    estimatedCompletionTime?: Date;
    customerId: string;
    customerNotes?: string;
  };
}

export interface GetOrderRequest extends Request {
  params: {
    orderId: string;
  };
}
