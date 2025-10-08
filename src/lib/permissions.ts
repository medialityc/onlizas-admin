export enum PERMISSION_ENUM {
  // Generic CRUD operations
  CREATE = "Create",
  RETRIEVE = "Retrieve",
  UPDATE = "Update",
  DELETE = "Delete",

  // Section permissions
  CREATE_SECTION = "CreateSection",
  UPDATE_SECTION = "UpdateSection",
  DELETE_SECTION = "DeleteSection",
  RETRIEVE_SECTION = "RetrieveSection",

  // Business permissions
  CREATE_BUSINESS = "CreateBusiness",
  UPDATE_BUSINESS = "UpdateBusiness",
  DELETE_BUSINESS = "DeleteBusiness",
  RETRIEVE_BUSINESS = "RetrieveBusiness",

  // Store permissions
  CREATE_STORE = "CreateStore",
  UPDATE_STORE = "UpdateStore",
  DELETE_STORE = "DeleteStore",
  RETRIEVE_STORE = "RetrieveStore",
}

export const PERMISSION_ADMIN = [
  PERMISSION_ENUM.CREATE,
  PERMISSION_ENUM.UPDATE,
  PERMISSION_ENUM.RETRIEVE,
  PERMISSION_ENUM.DELETE,
];

export const PERMISSIONS = [
  {
    code: PERMISSION_ENUM.CREATE,
    description: "This permission allows to create an entity",
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
    code: PERMISSION_ENUM.CREATE_SECTION,
    description: "This permission allows to create a section",
  },
  {
    code: PERMISSION_ENUM.UPDATE_SECTION,
    description: "This permission allows to update a section",
  },
  {
    code: PERMISSION_ENUM.DELETE_SECTION,
    description: "This permission allows to delete a section",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_SECTION,
    description: "This permission allows to retrieve a section",
  },
  {
    code: PERMISSION_ENUM.CREATE_BUSINESS,
    description: "This permission allows to create a business",
  },
  {
    code: PERMISSION_ENUM.UPDATE_BUSINESS,
    description: "This permission allows to update a business",
  },
  {
    code: PERMISSION_ENUM.DELETE_BUSINESS,
    description: "This permission allows to delete a business",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_BUSINESS,
    description: "This permission allows to retrieve a business",
  },
  {
    code: PERMISSION_ENUM.CREATE_STORE,
    description: "This permission allows to create a store",
  },
  {
    code: PERMISSION_ENUM.UPDATE_STORE,
    description: "This permission allows to update a store",
  },
  {
    code: PERMISSION_ENUM.DELETE_STORE,
    description: "This permission allows to delete a store",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_STORE,
    description: "This permission allows to retrieve a store",
  },
];
