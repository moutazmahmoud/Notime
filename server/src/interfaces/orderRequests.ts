import { Request } from "express";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface AddOrderRequest extends AuthenticatedRequest {
  body: {
    items: { item: string; quantity: number }[];
    totalPrice: number;
    estimatedCompletionTime?: Date;
    customerId: string;
    customerNotes?: string;
    orderDate?: Date;
    preferredPickupTime?: Date;
  };
}

export interface GetOrderRequest extends AuthenticatedRequest {
  params: {
    orderId: string;
  };
}

export interface UpdateOrderRequest extends AuthenticatedRequest {
  params: {
    orderId: string;
  };
  body: {
    status?: string;
    customerNotes?: string;
    items?: { item: string; quantity: number }[];
    totalPrice?: number;
    customerId?: string;
    preferredPickupTime?: Date;
    cancelReason?: string;
    estimatedCompletionTime?: Date;
    orderDate?: Date;
  };
}

export interface updateOrderStatusRequest extends AuthenticatedRequest {
  params: {
    orderId: string;
  };
  body: {
    status?: string;
  };
}
