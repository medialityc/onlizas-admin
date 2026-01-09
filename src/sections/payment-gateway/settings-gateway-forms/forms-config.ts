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
};
