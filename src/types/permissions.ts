import { PaginatedResponse } from "./common";


// Permission types
export interface IPermission {
  id: number;
  name: string;
  code: string;
  description: string;
  entity: string;
  permissionType: number;
  roleId: number;
  roleName: string;
  roleCode: string;
}

export interface ICreatePermission {
  name: string;
  code: string;
  description: string;
/*   entity: string; */
  permissionType: number;
  roleId: number;
  roleName: string;
  roleCode: string;
}

export type PermissionAttributeLog = {
  changedAt: string;
  changedBy: string;
  attributesJson: string;
};
// Response types
export type GetAllPermissionsResponse = PaginatedResponse<IPermission>;

export type UpdatePermissionResponse = { message: string };

export type UpdatePermissionAttributesResponse = { success: boolean };

export type CreatePermissionRequest = {
  name: string;
  code: string;
  entity: string;
  description: string;
  type: number;
  roleId: number;
};

export type CreatePermissionResponse = { status: string };

export type PermissionUpdateData = {
  name: string;
  code: string;
  description: string;
  entity: string;
  type: number;
};

export type DeletePermissionResponse = { status: string };
