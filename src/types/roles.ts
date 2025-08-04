import { PaginatedResponse } from "./common";
import { IPermission } from "./permissions";

// Role types
export interface IRole {
  id: number;
  name: string;
  code: string;
  description: string;
  subSystemId: number;
  subSystemName: string;
  subSystemCode: string;
  permissions: IPermission[];
}

// Response types
export type GetAllRolesResponse = PaginatedResponse<IRole>;

export type UpdateRoleResponse = { message: string };

export type UpdateRoleAttributesResponse = { success: boolean };

export type CreateRoleRequest = {
  name: string;
  code: string;
  description: string;
  subSystemId: number;
};

export type CreateRoleResponse = { status: string };


export type DeleteRoleResponse = { status: string };


