import { PaginatedResponse } from "./common";

export type InventoryReview = {
  id: string;
  productQuality: number;
  supplierQuality: number;
  deliveryQuality: number;
  averageScore: number;
  message: string;
  inventoryId: string;
  userId: string;
  userName: string;
  active: boolean;
  media: string[];
};

export type GetInventoryReviewsResponse = PaginatedResponse<InventoryReview>;

export type InventoryReviewSummary = {
  averageScore: number;
  productQuality: number;
  supplierQuality: number;
  deliveryQuality: number;
  totalReviews: number;
};

export type InventoryReviewsSummaryMap = Record<string, InventoryReviewSummary>;
