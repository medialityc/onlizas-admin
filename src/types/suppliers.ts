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

export type PendingSupplier = Supplier & {
  phone: string;
  address: string;
  message: string;
  approvalProcessId: number;
  pendingDocuments: [
    {
      fileName: string;
      content: string;
    },
  ];
};

export type ValidSupplier = Supplier & {
  lastEvaluationDate: string;
  pendingDocuments: [
    {
      fileName: string;
      content: string;
    },
  ];
};

export type SupplierDetails = Supplier & {
  phone: string;
  address: string;
  message: string;
  approvalProcessId: number;
  pendingDocuments: [
    {
      fileName: string;
      content: string;
    },
  ];
};

export type UpdateSupplier = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  type: string;
  isActive: boolean;
  pendingDocuments: { fileName: string; content: File | string }[];
};

export type ApprovalProcess = {
  id: number;
  status: string;
  createdDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  comments: string;
  approvedBy?: string;
  rejectedBy?: string;
};

export type SupplierEvaluation = {
  id: number;
  supplierId: number;
  rating: number;
  evaluationDate: string;
  comments: string;
  evaluatedBy: string;
  criteria: {
    quality: number;
    delivery: number;
    price: number;
    service: number;
  };
};

export type GetAllSuppliers = PaginatedResponse<Supplier>;
export type GetAllPendingSuppliers = PaginatedResponse<PendingSupplier>;
export type GetAllValidSuppliers = PaginatedResponse<ValidSupplier>;
export type GetSupplierEvaluations = PaginatedResponse<SupplierEvaluation>;
