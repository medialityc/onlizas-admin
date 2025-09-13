import { GatewayFormProps, TypeGateway } from "@/app/payment/interfaces";

export const gatewaysConfig: Record<TypeGateway["type"], GatewayFormProps> = {
  stripe: {
    name: "Stripe",
    alertText:
      "All credentials are encrypted and stored securely. Never share your secret keys.",
    fields: [
      {
        id: "stripe-publishable",
        label: "Publishable Key",
        placeholder: "pk_test_...",
      },
      {
        id: "stripe-secret",
        label: "Secret Key",
        placeholder: "sk_test_...",
        type: "password",
      },
      {
        id: "stripe-webhook",
        label: "Webhook Secret",
        placeholder: "whsec_...",
        type: "password",
      },
    ],
    switchField: { id: "stripe-live", label: "Live Mode (Production)" },
    buttonText: "Save Stripe Configuration",
  },
  paypal: {
    name: "PayPal",
    alertText:
      "Configure your PayPal application credentials from the PayPal Developer Dashboard.",
    fields: [
      {
        id: "paypal-client-id",
        label: "Client ID",
        placeholder: "AYjcyDQQpLO6...",
      },
      {
        id: "paypal-client-secret",
        label: "Client Secret",
        placeholder: "EHxWIrQZtNM...",
        type: "password",
      },
    ],
    selectField: {
      id: "paypal-mode",
      label: "Environment",
      options: [
        { value: "sandbox", label: "Sandbox (Testing)" },
        { value: "live", label: "Live (Production)" },
      ],
    },
    buttonText: "Save PayPal Configuration",
  },
  tropipay: {
    name: "Tropipay",
    alertText:
      "Configure your Tropipay merchant credentials for Latin American payments.",
    fields: [
      {
        id: "tropipay-client-id",
        label: "Client ID",
        placeholder: "your-client-id",
      },
      {
        id: "tropipay-client-secret",
        label: "Client Secret",
        placeholder: "your-client-secret",
        type: "password",
      },
      {
        id: "tropipay-merchant-token",
        label: "Merchant Token",
        placeholder: "merchant-token",
        type: "password",
      },
      {
        id: "tropipay-endpoint",
        label: "API Endpoint",
        placeholder: "https://api.tropipay.com",
      },
    ],
    buttonText: "Save Tropipay Configuration",
  },
  square: {
    name: "Square",
    alertText: "Configure your Square application for US-based payments.",
    fields: [
      {
        id: "square-access-token",
        label: "Access Token",
        placeholder: "EAAAEOuLQOGrCn...",
        type: "password",
      },
      {
        id: "square-location-id",
        label: "Location ID",
        placeholder: "L7HG8RD2...",
      },
    ],
    switchField: { id: "square-sandbox", label: "Sandbox Mode" },
    buttonText: "Save Square Configuration",
  },
  authorize: {
    name: "Authorize.Net",
    alertText: "Configure your Authorize.Net merchant account credentials.",
    fields: [
      {
        id: "authnet-login-id",
        label: "API Login ID",
        placeholder: "your-api-login-id",
      },
      {
        id: "authnet-transaction-key",
        label: "Transaction Key",
        placeholder: "your-transaction-key",
        type: "password",
      },
    ],
    switchField: { id: "authnet-sandbox", label: "Sandbox Mode" },
    buttonText: "Save Authorize.Net Configuration",
  },
  bank: {
    name: "Bank Transfer",
    alertText: "Configure bank account details for direct transfer payments.",
    fields: [
      { id: "bank-name", label: "Bank Name", placeholder: "Bank of America" },
      {
        id: "account-number",
        label: "Account Number",
        placeholder: "1234567890",
      },
      {
        id: "routing-number",
        label: "Routing Number / SWIFT",
        placeholder: "021000021",
      },
      {
        id: "beneficiary",
        label: "Beneficiary Name",
        placeholder: "Your Company Name",
      },
      {
        id: "instructions",
        label: "Payment Instructions",
        placeholder: "Additional instructions...",
        component: "textarea",
      },
    ],
    buttonText: "Save Bank Transfer Configuration",
  },
};
