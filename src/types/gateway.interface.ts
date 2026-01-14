import { PaginatedResponse } from "./common";

export type Gateway={
  id:string,
  name:string,
  code:string,
  description:string,
  isEnabled:boolean,
  isDefault:boolean,
  key:string
}

export type GetAllGateways=PaginatedResponse<Gateway>


export type GatewayType =
  | "stripe"
  | "paypal";

export interface TypeGateway {
  id: number;
  name: string;
  type: GatewayType;
  status: "active" | "inactive";
  created: string;
}

export interface Field {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "url" | "email" | "number";
  component?: "input" | "textarea";
  required?: boolean;
}

export interface GatewaySwitch {
  id: string;
  label: string;
}

export interface GatewaySelect {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface GatewayFormProps {
  alertText: string;
  fields: Field[];
  switchField?: GatewaySwitch;
  selectField?: GatewaySelect;
  buttonText: string;
}

export type GatewaysConfig = Record<GatewayType, GatewayFormProps>;

// Legacy interfaces for backward compatibility
export interface GatewayI {
  name: string;
  lastTest: string;
  transactions: string;
  status: string;
}

export type GatewayName =
  | "Stripe"
  | "PayPal";

export interface GatewayTest {
  name: string;
  status: "success" | "failed";
  lastTest: string;
  latency: string;
}

export interface TestResult {
  gateway: string;
  type: string;
  result: "Success" | "Failed";
  time: string;
  timestamp: string;
}

