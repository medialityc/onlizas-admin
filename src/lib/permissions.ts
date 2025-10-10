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
  DEACTIVATE_BUSINESS = "DeactivateBusiness",

  // Store permissions
  CREATE_STORE = "CreateStore",
  UPDATE_STORE = "UpdateStore",
  DELETE_STORE = "DeleteStore",
  RETRIEVE_STORE = "RetrieveStore",

  // Aduana permissions
  RETRIEVE_ADUANA_CATEGORIES = "RetrieveAduanaCategories",

  // Approval Process permissions
  CREATE_APPROVAL_PROCESS = "CreateApprovalProcess",
  UPDATE_APPROVAL_PROCESS = "UpdateApprovalProcess",
  DELETE_APPROVAL_PROCESS = "DeleteApprovalProcess",
  RETRIEVE_APPROVAL_PROCESS = "RetrieveApprovalProcess",
  APPROVE_APPROVAL_PROCESS = "ApproveApprovalProcess",
  CREATE_USER_BEFORE_APPROVE = "CreateUserBeforeApprove",

  // Banner permissions
  CREATE_BANNER = "CreateBanner",
  UPDATE_BANNER = "UpdateBanner",
  DELETE_BANNER = "DeleteBanner",
  RETRIEVE_BANNER = "RetrieveBanner",
  READ_BANNER = "ReadBanner",
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
    description: "This permission allows to delete a category",
  },
  {
    code: PERMISSION_ENUM.UPDATE_SECTION,
    description: "This permission allows to delete a category",
  },
  {
    code: PERMISSION_ENUM.DELETE_SECTION,
    description: "This permission allows to delete a category",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_SECTION,
    description: "This permission allows to delete a category",
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
    code: PERMISSION_ENUM.DEACTIVATE_BUSINESS,
    description: "This permission allows to deactivate a business",
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
  {
    code: PERMISSION_ENUM.RETRIEVE_ADUANA_CATEGORIES,
    description: "This permission allows to retrieve aduana categories",
  },
  {
    code: PERMISSION_ENUM.CREATE_APPROVAL_PROCESS,
    description: "This permission allows to create an approval process",
  },
  {
    code: PERMISSION_ENUM.UPDATE_APPROVAL_PROCESS,
    description: "This permission allows to update an approval process",
  },
  {
    code: PERMISSION_ENUM.DELETE_APPROVAL_PROCESS,
    description: "This permission allows to delete an approval process",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_APPROVAL_PROCESS,
    description: "This permission allows to retrieve an approval process",
  },
  {
    code: PERMISSION_ENUM.APPROVE_APPROVAL_PROCESS,
    description: "This permission allows to approve an approval process",
  },
  {
    code: PERMISSION_ENUM.CREATE_USER_BEFORE_APPROVE,
    description: "This permission allows to create a user before approving an approval process",
  },
  {
    code: PERMISSION_ENUM.CREATE_BANNER,
    description: "This permission allows to create a banner",
  },
  {
    code: PERMISSION_ENUM.UPDATE_BANNER,
    description: "This permission allows to update a banner",
  },
  {
    code: PERMISSION_ENUM.DELETE_BANNER,
    description: "This permission allows to delete a banner",
  },
  {
    code: PERMISSION_ENUM.RETRIEVE_BANNER,
    description: "This permission allows to retrieve a banner",
  },
  {
    code: PERMISSION_ENUM.READ_BANNER,
    description: "This permission allows to retrieve a banner",
  },
];
