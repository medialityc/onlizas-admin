import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Stat } from "../interfaces/stats.interface";
import {
  Gateway,
  GatewayTest,
  TestResult,
  TypeGateway,
} from "../interfaces/gateway.interface";
import { Activity, ConfigChange, Log, PaymentMethod } from "../interfaces";

export const mockStats: Stat[] = [
  {
    title: "Active Gateways",
    subtitle: "+1 from last month",
    value: "4",
    icon: CreditCard,
  },
  {
    title: "Total Transactions",
    subtitle: "+12% from last month",
    value: "12,847",
    icon: DollarSign,
  },
  {
    title: "Success Rate",
    subtitle: "+0.3% from last month",
    value: "98.2%",
    icon: TrendingUp,
  },
  {
    title: "Failed Tests",
    subtitle: "Requires attention",
    value: "2",
    icon: AlertTriangle,
  },
];

export const mockGateways: Gateway[] = [
  {
    name: "Stripe",
    lastTest: "2 hours ago",
    transactions: "8,234",
    status: "active",
  },
  {
    name: "PayPal",
    lastTest: "1 hour ago",
    transactions: "3,421",
    status: "active",
  },
  {
    name: "Tropipay",
    lastTest: "30 minutes ago",
    transactions: "892",
    status: "active",
  },
  {
    name: "Bank Transfer",
    status: "active",
    lastTest: "N/A",
    transactions: "300",
  },
  {
    name: "Square",
    status: "inactive",
    lastTest: "Failed",
    transactions: "0",
  },
];

export const gateways: TypeGateway[] = [
  {
    id: "stripe-1",
    name: "Stripe",
    type: "stripe",
    status: "active",
    created: "2024-01-15",
  },
  {
    id: "paypal-1",
    name: "PayPal",
    type: "paypal",
    status: "active",
    created: "2024-01-10",
  },
  {
    id: "tropipay-1",
    name: "Tropipay",
    type: "tropipay",
    status: "active",
    created: "2024-02-01",
  },
  {
    id: "square-1",
    name: "Square",
    type: "square",
    status: "inactive",
    created: "2024-01-20",
  },
];

export const activities: Activity[] = [
  {
    action: "Gateway Added",
    gateway: "Tropipay",
    user: "admin@company.com",
    time: "2 hours ago",
  },
  {
    action: "Credentials Updated",
    gateway: "Stripe",
    user: "finance@company.com",
    time: "1 day ago",
  },
  {
    action: "Gateway Disabled",
    gateway: "Square",
    user: "admin@company.com",
    time: "2 days ago",
  },
  {
    action: "Test Performed",
    gateway: "PayPal",
    user: "dev@company.com",
    time: "3 days ago",
  },
];

export const logs: Log[] = [
  {
    timestamp: "2024-03-15 14:30:22",
    action: "GATEWAY_ADDED",
    gateway: "Tropipay",
    user: "admin@company.com",
    ip: "192.168.1.100",
    details: "New gateway configuration",
  },
  {
    timestamp: "2024-03-14 09:15:33",
    action: "CREDENTIALS_UPDATED",
    gateway: "Stripe",
    user: "finance@company.com",
    ip: "192.168.1.101",
    details: "API keys rotated",
  },
  {
    timestamp: "2024-03-13 16:45:12",
    action: "GATEWAY_DISABLED",
    gateway: "Square",
    user: "admin@company.com",
    ip: "192.168.1.100",
    details: "Failed connection tests",
  },
  {
    timestamp: "2024-03-12 11:20:45",
    action: "TEST_PERFORMED",
    gateway: "PayPal",
    user: "dev@company.com",
    ip: "192.168.1.102",
    details: "Connection test successful",
  },
];

export const changes: ConfigChange[] = [
  {
    gateway: "Stripe",
    field: "Webhook Secret",
    oldValue: "whsec_***old***",
    newValue: "whsec_***new***",
    user: "finance@company.com",
    timestamp: "2024-03-14 09:15:33",
  },
  {
    gateway: "PayPal",
    field: "Environment",
    oldValue: "sandbox",
    newValue: "live",
    user: "admin@company.com",
    timestamp: "2024-03-13 14:22:11",
  },
];

export const initialMethods: PaymentMethod[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Credit/Debit Cards",
    enabled: true,
    primary: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "PayPal Wallet",
    enabled: true,
    primary: false,
  },
  {
    id: "tropipay",
    name: "Tropipay",
    description: "Latin American Payments",
    enabled: true,
    primary: false,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Direct Bank Transfer",
    enabled: true,
    primary: false,
  },
  {
    id: "square",
    name: "Square",
    description: "Square Payments",
    enabled: false,
    primary: false,
  },
];

export const gatewayTests: GatewayTest[] = [
  {
    name: "Stripe",
    status: "success",
    lastTest: "2 minutes ago",
    latency: "120ms",
  },
  {
    name: "PayPal",
    status: "success",
    lastTest: "5 minutes ago",
    latency: "340ms",
  },
  {
    name: "Tropipay",
    status: "success",
    lastTest: "1 hour ago",
    latency: "890ms",
  },
  {
    name: "Square",
    status: "failed",
    lastTest: "2 hours ago",
    latency: "timeout",
  },
];

export const testResults: TestResult[] = [
  {
    gateway: "Stripe",
    type: "Connection",
    result: "Success",
    time: "120ms",
    timestamp: "2024-03-15 14:30",
  },
  {
    gateway: "PayPal",
    type: "Transaction",
    result: "Success",
    time: "340ms",
    timestamp: "2024-03-15 14:25",
  },
  {
    gateway: "Tropipay",
    type: "Connection",
    result: "Success",
    time: "890ms",
    timestamp: "2024-03-15 14:20",
  },
  {
    gateway: "Square",
    type: "Connection",
    result: "Failed",
    time: "Timeout",
    timestamp: "2024-03-15 12:15",
  },
];
