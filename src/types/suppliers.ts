import { PaginatedResponse } from "./common";

export type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  currentRating: number;
  lastEvaluationDate: string;
  isActive: boolean;
  isAproved: boolean;
  state: "Pending" | "WaitingLogin" | "Approved" | "Rejected";
  expirationDate: string;
  message: string;
  sellerType?: "Persona" | "Empresa" | "";
  nacionality?: "Nacional" | "Extranjero" | "Ambos" | "";
  mincexCode?: string;
  pendingDocuments: Document[];
  approvedDocuments: Document[];
  pendingCategories: Category[];
  approvedCategories: Category[];
};

export type Category = {
  id: number;
  name: string;
  state: boolean;
  departmentId: number;
  departmentName: string;
};

export type Document = {
  id: number;
  fileName: string;
  content: string;
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

export const processesState = [
  {
    id: 0,
    name: "Pendiente",
    value: "Pending",
  },
  {
    id: 1,
    name: "Pendiente de usuario",
    value: "WaitingLogin",
  },
  { id: 2, name: "Aprobado", value: "Approved" },
  { id: 3, name: "Rechazado", value: "Rejected" },
];

export type SupplierDetails = Supplier & {
  phone: string;
  address: string;
  message: string;
  id: number;
  state: "Pending" | "WaitingLogin" | "Approved" | "Rejected";
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

export type SupplierApprovalProcess = {
  approvalProcessId: number;
  state: string;
  isApproved: boolean;
  name: string;
  email: string;
  phone: string;
  countryId: number;
  countryName: string;
  nacionality: string;
  sellerType: string;
  mincexCode: string;
  expirationDate: string;
  approvedDocuments: {
    id: number;
    fileName: string;
    isApproved: boolean;
  }[];
  approvedCategories: {
    id: number;
    name: string;
  }[];
  pendingDocuments: {
    id: number;
    fileName: string;
    isApproved: boolean;
  }[];
  pendingCategories: {
    id: number;
    name: string;
  }[];
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

export type AnswerApprovalProcess = {
  approvalProcessId: string;
  isApproved: boolean;
  comments: string;
};

export type GetAllSuppliers = PaginatedResponse<Supplier>;
export type GetAllPendingSuppliers = PaginatedResponse<PendingSupplier>;
export type GetAllValidSuppliers = PaginatedResponse<ValidSupplier>;
export type GetSupplierEvaluations = PaginatedResponse<SupplierEvaluation>;
