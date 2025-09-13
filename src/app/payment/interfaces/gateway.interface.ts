export interface Gateway {
  name: string;
  lastTest: string;
  transactions: string;
  status: string;
}
export interface TypeGateway {
  id: string;
  name: string;
  type: "stripe" | "paypal" | "tropipay" | "square" | "authorize" | "bank";
  status: "active" | "inactive";
  created: string;
}
export interface GatewaySwitch {
  id: string;
  label: string;
}
export interface Field {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  component?: "input" | "textarea";
}
export interface GatewaySelect {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}
export type GatewayName =
  | "Stripe"
  | "PayPal"
  | "Tropipay"
  | "Square"
  | "Authorize.Net"
  | "Bank Transfer";

export interface GatewayFormProps {
  name: string;
  alertText: string;
  fields: Field[];
  switchField?: GatewaySwitch;
  selectField?: GatewaySelect;
  buttonText?: string;
}
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
