const DASHBOARD = "/dashboard";

export const paths = {
  dashboard: {
    root: DASHBOARD,
    currencies: {
      list: `${DASHBOARD}/currencies`,
    },
    categories: {
      list: `${DASHBOARD}/categories`,
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
    },
    products: {
      list: `${DASHBOARD}/products`,
    },
    suppliers: {
      list: `${DASHBOARD}/suppliers`,
    },
  },
};
