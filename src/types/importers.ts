import { PaginatedResponse } from "./common";

export type Importer = {
  id: string;
  name: string;
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
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
  categories: string[];
  suppliersCount: number;
  isActive: boolean;
  createdDatetime: string;
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
