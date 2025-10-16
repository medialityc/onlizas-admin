export enum PERMISSION_ENUM {
  // Generic CRUD operations
  CREATE = "Create",
  RETRIEVE = "Retrieve",
  UPDATE = "Update",
  DELETE = "Delete",

  // Role permissions
  ASSIGN_ROLE = "AssignRole",
}

export const PERMISSION_ADMIN = [
  PERMISSION_ENUM.CREATE,
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
];
