const DASHBOARD = "/dashboard";
const PROVIDER = "/provider";

export const paths = {
  dashboard: {
    root: DASHBOARD,
    logs: {
      list: `${DASHBOARD}/businesslogs`,
    },
    currencies: {
      list: `${DASHBOARD}/currencies`,
    },
    categories: {
      list: `${DASHBOARD}/categories`,
      view: (id: string | number) => `${DASHBOARD}/categories/${id}`,
      edit: (id: string | number) => `${DASHBOARD}/categories/${id}/edit`,
    },
    departments: {
      list: `${DASHBOARD}/departments`,
    },
    roles: {
      list: `${DASHBOARD}/roles`,
    },
    permissions: {
      list: `${DASHBOARD}/permissions`,
    },
    users: {
      list: `${DASHBOARD}/users`,
      create: `${DASHBOARD}/users/create`,
      edit: (id: string | number) => `${DASHBOARD}/users/${id}/edit/`,
      view: (id: string | number) => `${DASHBOARD}/users/${id}/view/`,
      documents: {
        list: (id: string | number) => `${DASHBOARD}/users/${id}/documents`,
      },
      notification: {
        list: `${DASHBOARD}/user/notifications`,
      },
    },
    products: {
      list: `${DASHBOARD}/products`,
      view: (id: string | number) => `${DASHBOARD}/products/${id}`,
      edit: (id: string | number) => `${DASHBOARD}/products/${id}/edit`,
    },
    warehouses: {
      list: `${DASHBOARD}/warehouses`,
      edit: (type: string, id: string | number) =>
        `${DASHBOARD}/warehouses/${type}/${id}/edit`,
      transfer: (type: string, id: string | number) =>
        `${DASHBOARD}/warehouses/${type}/${id}/edit/transfers`,
      view: (type: string, id: string | number) =>
        `${DASHBOARD}/warehouses/${type}/${id}`,
    },
    virtualWarehouseTypes: {
      list: `${DASHBOARD}/virtual-warehouse-types`,
    },
    suppliers: {
      list: `${DASHBOARD}/suppliers`,
    },
    business: {
      list: `${DASHBOARD}/business`,
    },
    stores: {
      list: `${DASHBOARD}/stores`,
    },
    inventory: {
      list: `${DASHBOARD}/inventory/provider`,
      all: `${DASHBOARD}/inventory`,
    },
    locations: {
      list: `${DASHBOARD}/locations`,
    },
    regions: {
      list: `${DASHBOARD}/regions`,
    },
    systemConfigurations: {
      list: `${DASHBOARD}/system-configurations`,
    },
    gateways: {
      overview: `${DASHBOARD}/overview`,
      auditHistory: `${DASHBOARD}/audit-history`,
      paymentGateway: `${DASHBOARD}/payment-gateways`,
      paymentMethods: `${DASHBOARD}/payment-methods`,
      testingValidation: `${DASHBOARD}/testing-validation`,
    },
  },
  provider: {
    root: PROVIDER,
    profile: {
      list: `${PROVIDER}/profile`,
    },
    products: {
      list: `${PROVIDER}/products`,
      edit: (id: string | number) => `${PROVIDER}/products/${id}/edit`,
      view: (id: string | number) => `${PROVIDER}/products/${id}`,
    },
    inventory: {
      list: `${PROVIDER}/inventory`,
    },
    warehouse: {
      list: `${PROVIDER}/warehouses`,
    },
    stores: {
      list: `${PROVIDER}/stores`,
    },
  },

  content: {
    sections: {
      list: `${DASHBOARD}/content/sections`,
      view: (id: string | number) => `${DASHBOARD}/content/sections/${id}`,
      edit: (id: string | number) => `${DASHBOARD}/content/sections/${id}/edit`,
      new: `${DASHBOARD}/content/sections/new`,
    },
    banners: {
      list: `${DASHBOARD}/content/home-banners`,
      view: (id: string | number) => `${DASHBOARD}/content/home-banners/${id}`,
      new: `${DASHBOARD}/content/home-banners/new`,
      edit: (id: string | number) =>
        `${DASHBOARD}/content/home-banners/${id}/edit`,
    },
  },
};
