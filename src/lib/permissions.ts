export enum PERMISSION_ENUM {
  // Generic CRUD operations
  CREATE = "Create",
  RETRIEVE = "Retrieve",
  UPDATE = "Update",
  DELETE = "Delete",

  // Supplier specific product creation (can only create/link own products)
  CREATE_PRODUCT = "CreateProduct",
  RETRIEVE_PRODUCT = "RetrieveProduct",
  UPDATE_PRODUCT = "UpdateProduct",
  DELETE_PRODUCT = "DeleteProduct",

  // Inventory specific supplier creation and retrieve
  CREATE_INVENTORY = "CreateInventory",
  RETRIEVE_INVENTORY = "RetrieveInventory",
  UPDATE_INVENTORY = "UpdateInventory",
  DELETE_INVENTORY = "DeleteInventory",

  // Variant
  CREATE_VARIANT = "CreateVariant",
  RETRIEVE_VARIANT = "RetrieveVariant",
  UPDATE_VARIANT = "UpdateVariant",
  DELETE_VARIANT = "DeleteVariant",

  // Store specific supplier retrieve (can only list own stores)
  RETRIEVE_STORE = "RetrieveStore",
  CREATE_STORE = "CreateStore",
  UPDATE_STORE = "UpdateStore",
  DELETE_STORE = "DeleteStore",

  // Warehouse specific supplier retrieve
  RETRIEVE_WAREHOUSE = "RetrieveWarehouse",
  CREATE_WAREHOUSE = "CreateWarehouse",
  UPDATE_WAREHOUSE = "UpdateWarehouse",
  DELETE_WAREHOUSE = "DeleteWarehouse",

  CREATE_TRANSFER = "CreateTransfer",
  RETRIEVE_TRANSFER = "RetrieveTransfer",
  UPDATE_TRANSFER = "UpdateTransfer",
  DELETE_TRANSFER = "DeleteTransfer",

  // Role permissions
  ASSIGN_ROLE = "AssignRole",

  UPDATE_BUSINESS = "UpdateBusiness",
  UPDATE_APPROVAL_PROCESS = "UpdateApprovalProcess",

  RETRIEVE_ORDERS = "RetrieveOrder",
  UPDATE_ORDERS = "UpdateOrder",
}
export const PERMISSION_ADMIN = [
  PERMISSION_ENUM.CREATE,
  PERMISSION_ENUM.UPDATE,
  PERMISSION_ENUM.RETRIEVE,
  PERMISSION_ENUM.DELETE,
];

export const PERMISSION_PRODUCT = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.CREATE_PRODUCT,
  PERMISSION_ENUM.RETRIEVE_PRODUCT,
  PERMISSION_ENUM.UPDATE_PRODUCT,
  PERMISSION_ENUM.DELETE_PRODUCT,
];
export const PERMISSION_STORE = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.CREATE_STORE,
  PERMISSION_ENUM.RETRIEVE_STORE,
  PERMISSION_ENUM.UPDATE_STORE,
  PERMISSION_ENUM.DELETE_STORE,
];
export const PERMISSION_WAREHOUSE = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.CREATE_WAREHOUSE,
  PERMISSION_ENUM.RETRIEVE_WAREHOUSE,
  PERMISSION_ENUM.UPDATE_WAREHOUSE,
  PERMISSION_ENUM.DELETE_WAREHOUSE,
];
export const PERMISSION_VARIANT = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.CREATE_VARIANT,
  PERMISSION_ENUM.RETRIEVE_VARIANT,
  PERMISSION_ENUM.UPDATE_VARIANT,
  PERMISSION_ENUM.DELETE_VARIANT,
];
export const PERMISSION_TRANSFER = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.CREATE_TRANSFER,
  PERMISSION_ENUM.RETRIEVE_TRANSFER,
  PERMISSION_ENUM.UPDATE_TRANSFER,
  PERMISSION_ENUM.DELETE_TRANSFER,
];
export const PERMISSION_INVENTORY = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.CREATE_INVENTORY,
  PERMISSION_ENUM.RETRIEVE_INVENTORY,
  PERMISSION_ENUM.UPDATE_INVENTORY,
  PERMISSION_ENUM.DELETE_INVENTORY,
];
export const PERMISSION_ORDERS = [
  ...PERMISSION_ADMIN,
  PERMISSION_ENUM.RETRIEVE_ORDERS,
  PERMISSION_ENUM.UPDATE_ORDERS,
];

export const PERMISSION_SUPPLIER_ACCOUNTS = [
  PERMISSION_ENUM.CREATE_STORE,
  PERMISSION_ENUM.RETRIEVE_STORE,
  PERMISSION_ENUM.CREATE_INVENTORY,
  PERMISSION_ENUM.RETRIEVE_INVENTORY,
  PERMISSION_ENUM.CREATE_WAREHOUSE,
  PERMISSION_ENUM.RETRIEVE_WAREHOUSE,
  PERMISSION_ENUM.CREATE_PRODUCT,
  PERMISSION_ENUM.RETRIEVE_PRODUCT,
];

export const PERMISSIONS = [
  {
    code: PERMISSION_ENUM.CREATE,
    description: "This permission allows to create an entity",
  },
  {
    code: PERMISSION_ENUM.CREATE_PRODUCT,
    description:
      "This permission allows a supplier to create or link their own products",
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
    code: PERMISSION_ENUM.CREATE_INVENTORY,
    description:
      "Allows a supplier to create inventory records for own products",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_INVENTORY,
    description:
      "Allows a supplier to retrieve only their own inventory records",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_STORE,
    description: "Allows a supplier to retrieve only their own stores",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_WAREHOUSE,
    description: "Allows a supplier to retrieve only their own warehouses",
  },
];
