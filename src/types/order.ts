import { PaginatedResponse } from "./common";

export type Order = {
  id: string;
  customerId: string;
  status: number; // estado general de la orden
  orderNumber: string;
  totalAmountPaid: number;
  totalTaxAmount: number;
  totalDeliveryAmount: number;
  totalWeight: number;
  senderEmail: string;
  senderPhone: string;
  senderName: string;
  senderAddress: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverName: string;
  receiverAddress: string;
  createdDatetime: string;
  subOrders: SubOrder[];
  configuredTime: number;
};

export type SubOrder = {
  id: string;
  orderId: string;
  storeId: string;
  storeName: string;
  status: number;
  image: string;
  productName: string;
  requestedQuantity: number;
  subOrderNumber: string;
  amountPaid: number;
  taxAmount: number;
  deliveryAmount: number;
  weight: number;
  createdDatetime: string;
  factureUrl: string;
};

export type GetAllOrders = PaginatedResponse<Order>;

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Sent = 3,
  Received = 4,
  Cancelled = 5,
  Refunded = 6,
}
