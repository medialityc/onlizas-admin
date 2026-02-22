import {
  SUPPLIER_NATIONALITY,
  SUPPLIER_TYPE,
  SUPPLIER_TYPE_SELLER,
} from "@/sections/suppliers/constants/supplier.options";
import { PaginatedResponse } from "./common";

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  // Nuevos campos devueltos por la vista de proveedores
  countryName: string;
  businessName: string;
  businessCode: string;
  userId: string;
  // Campos antiguos que pueden no venir en todas las vistas
  currentRating?: number;
  lastEvaluationDate?: string;
  active: boolean;
  isAproved: boolean;
  state: SupplierState;
  fixedTax: number;
  expirationDate: string;
  message: string;
  sellerType?: SUPPLIER_TYPE_SELLER;
  nacionality?: SUPPLIER_NATIONALITY;
  supplierType?: SUPPLIER_TYPE;
  type?: SUPPLIER_TYPE;
  mincexCode?: string;
  pendingDocuments: Document[];
  approvedDocuments: Document[];
  pendingCategories: Category[];
  approvedCategories: Category[];
};

export type Category = {
  id: string;
  name: string;
  state: boolean;
  departmentId: number;
  departmentName: string;
};

export type Document = {
  id: string;
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
  countryCode: string;
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
  { id: 4, name: "Solicitud de extensión", value: "WaitingExtension" },
];

export type SupplierState =
  | "Pending"
  | "WaitingLogin"
  | "Approved"
  | "Rejected"
  | "WaitingExtension";

export type SupplierDetails = Supplier & {
  phone: string;
  countryCode: string;
  address: string;
  message: string;
  id: number;
  state: SupplierState;
  userId: number;
  countryId?: number;
  city?: string | number;
  districtId?: string | number;

  pendingDocuments: [
    {
      fileName: string;
      content: string;
    },
  ];
  businessName: string;
  businessCode: string;
};

export type UpdateSupplier = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  type: string;
  active: boolean;
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
  fixedTax?: number | null;
  pendingDocuments: EnhancedDocument[];
  approvedDocuments: EnhancedDocument[];
  pendingCategories: EnhancedCategory[];
  approvedCategories: EnhancedCategory[];
};

// New extended types for enhanced approval process
export type EnhancedDocument = {
  id: number;
  fileName: string;
  content: string;
  beApproved: boolean;
  rejectionReason: string;
};

export type CategoryFeature = {
  featureId: number;
  featureName: string;
  featureDescription: string;
  suggestions: string[];
  isRequired: boolean;
  isPrimary: boolean;
};

export type EnhancedCategory = {
  id: number;
  name: string;
  active: boolean;
  departmentId: number;
  departmentName: string;
  description: string;
  image: string;
  features: CategoryFeature[];
};

export type SupplierEvaluation = {
  id: number;
  supplierId: string;
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
