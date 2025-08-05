import { PaginatedResponse } from "./common";

export type Supplier = {
  id: number;
  name: string;
  email: string;
  type: string;
  currentRating: number;
  lastEvaluationDate: string;
  isActive: boolean;
  isAproved: boolean;
};

export type CreateSupplier = {
  name: string;
  supplierType: "Persona" | "Empresa";
  email: string;
  phone: string;
  address: string;
  createAutomaticAprovalProcess: boolean;
  documents: { fileName: string; content: File }[];
};

export const suppliersTypes = [
  { id: 0, name: "Persona" },
  { id: 1, name: "Empresa" },
] as const;

export type GetAllSuppliers = PaginatedResponse<Supplier>;
