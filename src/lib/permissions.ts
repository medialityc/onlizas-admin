export enum PERMISSION_ENUM {
  // Generic CRUD operations
  CREATE = "Create",
  RETRIEVE = "Retrieve",
  UPDATE = "Update",
  DELETE = "Delete",

  // Supplier generic operations
  SUPPLIER_CREATE = "SupplierCreate",
  SUPPLIER_RETRIEVE = "SupplierRetrieve",
  SUPPLIER_UPDATE = "SupplierUpdate",
  SUPPLIER_DELETE = "SupplierDelete",

  // Role permissions
  ASSIGN_ROLE = "AssignRole",

  UPDATE_BUSINESS = "UpdateBusiness",
  UPDATE_APPROVAL_PROCESS = "UpdateApprovalProcess",

  // Finance - supplier closures and summary
  RETRIEVE_CLOSURES = "RetrieveClosure",
  RETRIEVE_SUMMARY = "RetrieveSummary",
  // Dashboard
  RETRIEVE_DASHBOARD = "RetrieveDashBoard",
}
export const PERMISSION_ADMIN = [
  PERMISSION_ENUM.CREATE,
  PERMISSION_ENUM.UPDATE,
  PERMISSION_ENUM.RETRIEVE,
  PERMISSION_ENUM.DELETE,
];

export const PERMISSION_PRODUCT = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
  PERMISSION_ENUM.SUPPLIER_DELETE,
];
export const PERMISSION_STORE = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
  PERMISSION_ENUM.SUPPLIER_DELETE,
];
export const PERMISSION_WAREHOUSE = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
  PERMISSION_ENUM.SUPPLIER_DELETE,
];
export const PERMISSION_VARIANT = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
  PERMISSION_ENUM.SUPPLIER_DELETE,
];
export const PERMISSION_TRANSFER = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
  PERMISSION_ENUM.SUPPLIER_DELETE,
];
export const PERMISSION_INVENTORY = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
  PERMISSION_ENUM.SUPPLIER_DELETE,
];
export const PERMISSION_ORDERS = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  PERMISSION_ENUM.SUPPLIER_UPDATE,
];

// Finance views
export const PERMISSION_FINANCE_SUPPLIER_CLOSURES = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.RETRIEVE_CLOSURES,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  "RetrieveClosures",
];

export const PERMISSION_SUPPLIER_ACCOUNTS = [
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
];

export const PERMISSION_SUPPLIER_ZONES = [
  PERMISSION_ENUM.SUPPLIER_CREATE,
  PERMISSION_ENUM.SUPPLIER_RETRIEVE,
];

export const PERMISSIONS = [
  {
    code: PERMISSION_ENUM.CREATE,
    description: "This permission allows to create an entity",
  },
  {
    code: PERMISSION_ENUM.SUPPLIER_CREATE,
    description:
      "This permission allows a supplier to create entities in supplier scope",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE,
    description: "This permission allows to retrieve an entity",
  },
  {
    code: PERMISSION_ENUM.UPDATE,
    description: "This permission allows to update an entity",
  },
  {
    code: PERMISSION_ENUM.DELETE,
    description: "This permission allows to delete an entity",
  },
  {
    code: PERMISSION_ENUM.ASSIGN_ROLE,
    description: "This permission allows to assign roles to users",
  },
  {
    code: PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    description:
      "Allows a supplier to retrieve entities in supplier scope",
  },
  {
    code: PERMISSION_ENUM.SUPPLIER_UPDATE,
    description:
      "Allows a supplier to update entities in supplier scope",
  },
  {
    code: PERMISSION_ENUM.SUPPLIER_DELETE,
    description: "Allows a supplier to delete entities in supplier scope",
  },
];
