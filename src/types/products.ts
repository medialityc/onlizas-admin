import { PaginatedResponse } from "./common";

export type Product = {
  id: number;
  name: string;
  description: string;
  customsValueCup: number;
  customsValueUsd: number;
  weight: number;
  isDurable: boolean;
  categoryId: number;
  unitId: number;
};

export type CreateProduct = Omit<Product, "id">;

export type UpdateProduct = Omit<Product, "id" | "productId">;

export type GetAllProducts = PaginatedResponse<Product>;
