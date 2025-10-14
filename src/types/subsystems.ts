import { Attributes } from 'react';
import { PaginatedResponse } from './common';
import { IRole } from './roles';

export type BaseSubsystem = {
	id: string;
	name: string;
	code: string;
};

// Subsystem types
export interface ISubsystem extends BaseSubsystem {
	roles: IRole[];
	description: string;
	baseUrl: string;
	sessionExpiredWebhook: string;
	userBlockedWebhook: string;
	changedRoleWebhook: string;
	changedPermissionWebhook: string;
	verifiedUserWebhook: string;
	photoUrls: string[];
	businesses: ISubsystemBusinesses[];
	attributes: Attributes[];
	isActive: boolean;
}

export interface ISubsystemBusinesses {
	id: string;
	name: string;
	code: string;
}
// Response types
export type GetAllSubsystemsResponse = PaginatedResponse<ISubsystem>;
