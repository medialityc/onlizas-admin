import { PaginatedResponse } from "./common";

export type Importer = {
  id: string;
  name: string;
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  nomenclators?: Array<{
    id: string;
    name: string;
    isActive: boolean;
    createdAt?: string;
    createdDatetime?: string;
  }>;
  contracts?: Array<{
    id: string;
    importerId: string;
    importerName: string;
    supplierId: string;
    supplierName: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt?: string;
    createdDatetime?: string;
  }>;
};

export type GetImporters = PaginatedResponse<Importer>;

export type CreateImporterPayload = {
  name: string;
};

export type UpdateImporterPayload = {
  name: string;
};

export type ImporterNomenclator = {
  id: string;
  name: string;
  categories?: string[];
  suppliersCount?: number;
  isActive: boolean;
  createdDatetime?: string;
  createdAt?: string;
};

export type GetImporterNomenclators = PaginatedResponse<ImporterNomenclator>;

export type ImporterContractRequest = {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  nomenclatorName: string;
  requestedDatetime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export type GetImporterContractRequests = PaginatedResponse<ImporterContractRequest>;

export type SupplierContract = {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  nomenclatorName: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "TERMINATED";
};

export type GetSupplierContracts = PaginatedResponse<SupplierContract>;

export type ImporterAccessResponse = {
  token: string;
  expiresIn: number;
  importer: Importer;
};

export type QRCodeResponse = {
  importerId: string;
  importerName: string;
  secretKey: string;
  qrCodeUrl: string;
  qrCodeImageBase64: string;
  createdAt: string;
  instructions: string;
};

export type Category = {
  id: string;
  name: string;
  active: boolean;
  departmentId: string;
  departmentName: string;
  description: string;
  image: string;
  features: Array<{
    featureId: string;
    featureName: string;
    featureDescription: string;
    suggestions: string[];
    isRequired: boolean;
    isPrimary: boolean;
  }>;
};

export type ImporterNomenclatorDetail = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  categories: Category[];
};

export type ImporterContract = {
  id: string;
  importerId: string;
  importerName: string;
  approvalProcessId: string;
  approvalProcessName: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  approvalProcessUser?: {
    userId: string;
    userName: string;
    userEmail: string;
  };
};

export type ImporterDataResponse = {
  importerId: string;
  importerName: string;
  isActive: boolean;
  nomenclators: ImporterNomenclatorDetail[];
  contracts: ImporterContract[];
  accessedAt: string;
  sessionExpiresAt: string;
};

export type ImporterSession = {
  sessionId: string;
  importerId: string;
  importerName: string;
  createdAt: string;
  expiresAt: string;
  lastAccessedAt: string;
  ipAddress: string;
  isActive: boolean;
  isExpired: boolean;
};
