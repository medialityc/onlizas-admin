import type { GatewaysConfig } from "@/types/gateway.interface";

export const gatewaysConfig: GatewaysConfig = {
  stripe: {
    alertText:
      "Configure your Stripe payment gateway. All fields are required for proper integration.",
    fields: [
      {
        id: "stripe-publishable",
        label: "Publishable Key",
        placeholder: "pk_test_...",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "stripe-secret",
        label: "Secret Key",
        placeholder: "sk_test_...",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "stripe-webhook",
        label: "Webhook Secret",
        placeholder: "whsec_...",
        type: "password",
        component: "input",
        required: true,
      },
    ],
    switchField: {
      id: "stripe-live",
      label: "Live Mode",
    },
    buttonText: "Save Stripe Configuration",
  },

  paypal: {
    alertText:
      "Configure your PayPal payment gateway. Ensure you have the correct credentials for your environment.",
    fields: [
      {
        id: "paypal-client-id",
        label: "Client ID",
        placeholder: "Your PayPal Client ID",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "paypal-client-secret",
        label: "Client Secret",
        placeholder: "Your PayPal Client Secret",
        type: "password",
        component: "input",
        required: true,
      },
    ],
    selectField: {
      id: "paypal-mode",
      label: "Environment Mode",
      options: [
        { value: "sandbox", label: "Sandbox" },
        { value: "live", label: "Live" },
      ],
    },
    buttonText: "Save PayPal Configuration",
  },

  tropipay: {
    alertText:
      "Configure your TropiPay payment gateway. Make sure to use the correct endpoint for your region.",
    fields: [
      {
        id: "tropipay-client-id",
        label: "Client ID",
        placeholder: "Your TropiPay Client ID",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "tropipay-client-secret",
        label: "Client Secret",
        placeholder: "Your TropiPay Client Secret",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "tropipay-merchant-token",
        label: "Merchant Token",
        placeholder: "Your TropiPay Merchant Token",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "tropipay-endpoint",
        label: "API Endpoint",
        placeholder: "https://api.tropipay.com",
        type: "url",
        component: "input",
        required: true,
      },
    ],
    buttonText: "Save TropiPay Configuration",
  },

  square: {
    alertText:
      "Configure your Square payment gateway. Toggle sandbox mode for testing purposes.",
    fields: [
      {
        id: "square-access-token",
        label: "Access Token",
        placeholder: "Your Square Access Token",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "square-location-id",
        label: "Location ID",
        placeholder: "Your Square Location ID",
        type: "text",
        component: "input",
        required: true,
      },
    ],
    switchField: {
      id: "square-sandbox",
      label: "Sandbox Mode",
    },
    buttonText: "Save Square Configuration",
  },

  authorize: {
    alertText:
      "Configure your Authorize.Net payment gateway. Use sandbox mode for testing transactions.",
    fields: [
      {
        id: "authnet-login-id",
        label: "API Login ID",
        placeholder: "Your Authorize.Net Login ID",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "authnet-transaction-key",
        label: "Transaction Key",
        placeholder: "Your Authorize.Net Transaction Key",
        type: "password",
        component: "input",
        required: true,
      },
    ],
    switchField: {
      id: "authnet-sandbox",
      label: "Sandbox Mode",
    },
    buttonText: "Save Authorize.Net Configuration",
  },

  bank: {
    alertText:
      "Configure bank transfer details. Instructions field is optional for additional payment information.",
    fields: [
      {
        id: "bank-name",
        label: "Bank Name",
        placeholder: "Enter bank name",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "account-number",
        label: "Account Number",
        placeholder: "Enter account number",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "routing-number",
        label: "Routing Number / SWIFT",
        placeholder: "Enter routing number or SWIFT code",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "beneficiary",
        label: "Beneficiary Name",
        placeholder: "Enter beneficiary name",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "instructions",
        label: "Additional Instructions",
        placeholder: "Enter any additional payment instructions...",
        type: "text",
        component: "textarea",
        required: false,
      },
    ],
    buttonText: "Save Bank Transfer Configuration",
  },
};
