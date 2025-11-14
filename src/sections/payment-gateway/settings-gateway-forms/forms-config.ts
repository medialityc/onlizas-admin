import type { GatewaysConfig } from "@/types/gateway.interface";

export const gatewaysConfig: GatewaysConfig = {
  stripe: {
    alertText:
      "Configure su pasarela de pago Stripe. Todos los campos son obligatorios para una integración correcta.",
    fields: [
      {
        id: "stripe-publishable",
        label: "Clave Publicable",
        placeholder: "pk_test_...",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "stripe-secret",
        label: "Clave Secreta",
        placeholder: "sk_test_...",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "stripe-webhook",
        label: "Secreto Webhook",
        placeholder: "whsec_...",
        type: "password",
        component: "input",
        required: true,
      },
    ],
    switchField: {
      id: "stripe-live",
      label: "Modo Producción",
    },
    buttonText: "Guardar Configuración Stripe",
  },

  paypal: {
    alertText:
      "Configure su pasarela de pago PayPal. Asegúrese de tener las credenciales correctas para su entorno.",
    fields: [
      {
        id: "paypal-client-id",
        label: "ID de Cliente",
        placeholder: "Su ID de Cliente PayPal",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "paypal-client-secret",
        label: "Secreto de Cliente",
        placeholder: "Su Secreto de Cliente PayPal",
        type: "password",
        component: "input",
        required: true,
      },
    ],
    selectField: {
      id: "paypal-mode",
      label: "Modo de Entorno",
      options: [
        { value: "sandbox", label: "Sandbox" },
        { value: "live", label: "Producción" },
      ],
    },
    buttonText: "Guardar Configuración PayPal",
  },

  tropipay: {
    alertText:
      "Configure su pasarela de pago TropiPay. Asegúrese de usar el endpoint correcto para su región.",
    fields: [
      {
        id: "tropipay-client-id",
        label: "ID de Cliente",
        placeholder: "Su ID de Cliente TropiPay",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "tropipay-client-secret",
        label: "Secreto de Cliente",
        placeholder: "Su Secreto de Cliente TropiPay",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "tropipay-merchant-token",
        label: "Token de Comercio",
        placeholder: "Su Token de Comercio TropiPay",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "tropipay-endpoint",
        label: "Endpoint API",
        placeholder: "https://api.tropipay.com",
        type: "url",
        component: "input",
        required: true,
      },
    ],
    buttonText: "Guardar Configuración TropiPay",
  },

  square: {
    alertText:
      "Configure su pasarela de pago Square. Active el modo sandbox para propósitos de prueba.",
    fields: [
      {
        id: "square-access-token",
        label: "Token de Acceso",
        placeholder: "Su Token de Acceso Square",
        type: "password",
        component: "input",
        required: true,
      },
      {
        id: "square-location-id",
        label: "ID de Ubicación",
        placeholder: "Su ID de Ubicación Square",
        type: "text",
        component: "input",
        required: true,
      },
    ],
    switchField: {
      id: "square-sandbox",
      label: "Modo Sandbox",
    },
    buttonText: "Guardar Configuración Square",
  },

  authorize: {
    alertText:
      "Configure su pasarela de pago Authorize.Net. Use el modo sandbox para probar transacciones.",
    fields: [
      {
        id: "authnet-login-id",
        label: "ID de Login API",
        placeholder: "Su ID de Login Authorize.Net",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "authnet-transaction-key",
        label: "Clave de Transacción",
        placeholder: "Su Clave de Transacción Authorize.Net",
        type: "password",
        component: "input",
        required: true,
      },
    ],
    switchField: {
      id: "authnet-sandbox",
      label: "Modo Sandbox",
    },
    buttonText: "Guardar Configuración Authorize.Net",
  },

  bank: {
    alertText:
      "Configure los detalles de transferencia bancaria. El campo de instrucciones es opcional para información adicional de pago.",
    fields: [
      {
        id: "bank-name",
        label: "Nombre del Banco",
        placeholder: "Ingrese el nombre del banco",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "account-number",
        label: "Número de Cuenta",
        placeholder: "Ingrese el número de cuenta",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "routing-number",
        label: "Número de Ruta / SWIFT",
        placeholder: "Ingrese el número de ruta o código SWIFT",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "beneficiary",
        label: "Nombre del Beneficiario",
        placeholder: "Ingrese el nombre del beneficiario",
        type: "text",
        component: "input",
        required: true,
      },
      {
        id: "instructions",
        label: "Instrucciones Adicionales",
        placeholder: "Ingrese cualquier instrucción adicional de pago...",
        type: "text",
        component: "textarea",
        required: false,
      },
    ],
    buttonText: "Guardar Configuración de Transferencia Bancaria",
  },
};
