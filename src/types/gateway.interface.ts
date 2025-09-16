import type {
  gatewaysSchemas,
  StripeConfig,
  PaypalConfig,
  TropipayConfig,
  SquareConfig,
  AuthorizeConfig,
  BankConfig,
} from "@/sections/payment-gateway/settings-gateway-forms/gateway-schemas.schema";

export type GatewayType =
  | "stripe"
  | "paypal"
  | "tropipay"
  | "square"
  | "authorize"
  | "bank";

export interface TypeGateway {
  id: string;
  name: string;
  type: GatewayType;
  status: "active" | "inactive";
  created: string;
}

export type GatewayConfig =
  | StripeConfig
  | PaypalConfig
  | TropipayConfig
  | SquareConfig
  | AuthorizeConfig
  | BankConfig;

export interface GatewayWithConfig {
  type: GatewayType;
  config: GatewayConfig;
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

export type GatewayFormData<T extends GatewayType> = T extends "stripe"
  ? StripeConfig
  : T extends "paypal"
    ? PaypalConfig
    : T extends "tropipay"
      ? TropipayConfig
      : T extends "square"
        ? SquareConfig
        : T extends "authorize"
          ? AuthorizeConfig
          : T extends "bank"
            ? BankConfig
            : never;

export type GatewaySchema<T extends GatewayType> =
  T extends keyof typeof gatewaysSchemas ? (typeof gatewaysSchemas)[T] : never;

// Legacy interfaces for backward compatibility
export interface Gateway {
  name: string;
  lastTest: string;
  transactions: string;
  status: string;
}

export type GatewayName =
  | "Stripe"
  | "PayPal"
  | "Tropipay"
  | "Square"
  | "Authorize.Net"
  | "Bank Transfer";

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
