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

  // Role permissions
  ASSIGN_ROLE = "AssignRole",
}
export const PERMISSION_PRODUCT = [
  PERMISSION_ENUM.CREATE_PRODUCT,
  PERMISSION_ENUM.RETRIEVE_PRODUCT,
  PERMISSION_ENUM.UPDATE_PRODUCT,
  PERMISSION_ENUM.DELETE_PRODUCT,
];

export const PERMISSION_ADMIN = [
  PERMISSION_ENUM.CREATE,
  PERMISSION_ENUM.CREATE_PRODUCT,
  PERMISSION_ENUM.UPDATE,
  PERMISSION_ENUM.RETRIEVE,
  PERMISSION_ENUM.DELETE,
  PERMISSION_ENUM.ASSIGN_ROLE,
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
