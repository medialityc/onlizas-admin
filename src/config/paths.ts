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
      edit: (id: string | number) => `${DASHBOARD}/warehouses/${id}/edit`,
      view: (id: string | number) => `${DASHBOARD}/warehouses/${id}`,
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
  },
  provider: {
    root: PROVIDER,
    profile: {
      list: `${PROVIDER}/profile`,
    },
    products: {
      list: `${PROVIDER}/products`,
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
};
