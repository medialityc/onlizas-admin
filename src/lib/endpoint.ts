export const backendRoutes = {
  countries: { get: `${process.env.NEXT_PUBLIC_API_URL}countries` },
  users: {
    me: `${process.env.NEXT_PUBLIC_API_URL}users/me`,
    register: `${process.env.NEXT_PUBLIC_API_URL}Users/register`,
    search: `${process.env.NEXT_PUBLIC_API_URL}users/search`,
    scan: `${process.env.NEXT_PUBLIC_API_URL}users/scan`,
    resendEmail: `${process.env.NEXT_PUBLIC_API_URL}users/me/email/resend-verification`,
    resendPhone: `${process.env.NEXT_PUBLIC_API_URL}users/me/phone/resend-verification`,
    getAll: `${process.env.NEXT_PUBLIC_API_URL}users`,
    create: `${process.env.NEXT_PUBLIC_API_URL}users`,
    getById: (id: number) => `${process.env.NEXT_PUBLIC_API_URL}users/${id}`,
    update: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}users/${id}`,
    delete: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}`,
    blockToggle: `${process.env.NEXT_PUBLIC_API_URL}admin/users/block-toggle`,
    updateAttributes: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/attributes`,
    activateUser: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/activate`,
    getAttributeHistory: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/attributes/history`,
    getDocuments: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/documents`,
    getDocumentsById: (userId: number, documentId: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${userId}/documents/${documentId}`,
    uploadDocument: (userId: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${userId}/documents`,
    downloadDocument: (userId: number, documentId: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${userId}/documents/${documentId}/download`,
    scan_document: `${process.env.NEXT_PUBLIC_API_URL}users/scan-document`,
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/users`, // GET
  },
  roles: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}roles`,
    create: `${process.env.NEXT_PUBLIC_API_URL}roles`,
    update: (id: number) => `${process.env.NEXT_PUBLIC_API_URL}roles/${id}`,
    delete: (id: number) => `${process.env.NEXT_PUBLIC_API_URL}roles/${id}`,
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/roles`, // GET
  },
  permissions: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}roles/permissions`,
    create: `${process.env.NEXT_PUBLIC_API_URL}permissions`,
    update: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}permissions/${id}`,
    delete: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}roles/permissions/${id}`,
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/permissions`, // GET
  },
  categories: {
    create: `${process.env.NEXT_PUBLIC_API_URL}categories`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/categories`, // GET
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/categories`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, // PUT
    detail: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, // GET
  },
  products: {
    create: `${process.env.NEXT_PUBLIC_API_URL}admin/products`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/products`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/products/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/products/${id}`, // PUT
    deactivate: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/products/${id}/deactivate`, // PATCH
    canDelete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/products/${id}/can-delete`, // GET
    assignSuppliers: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/products/${id}/suppliers/assign`, // POST
    unassignSuppliers: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/products/${id}/suppliers/unassign`, // POST
    simpleCategories: `${process.env.NEXT_PUBLIC_API_URL}admin/products/categories/simple`, // GET
    simpleSuppliers: `${process.env.NEXT_PUBLIC_API_URL}admin/products/suppliers/simple`, // GET
    categoryFeatures: `${process.env.NEXT_PUBLIC_API_URL}admin/products/categories/features`, // GET
  },
  warehouses: {
    create: `${process.env.NEXT_PUBLIC_API_URL}warehouses`,
    list: `${process.env.NEXT_PUBLIC_API_URL}warehouses`,
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${id}`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${id}`,
    locations: `${process.env.NEXT_PUBLIC_API_URL}warehouses/locations`,
    transfers: `${process.env.NEXT_PUBLIC_API_URL}warehouses/transfers`,
    transferById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/transfers/${id}`,
  },
  departments: {
    create: `${process.env.NEXT_PUBLIC_API_URL}departments`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/departments`, // GET
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/departments`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}departments/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}departments/${id}`, // PUT
  },
  currencies: {
    create: `${process.env.NEXT_PUBLIC_API_URL}currencies`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}currencies`, // GET
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/currencies`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}currencies/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}currencies/${id}`, // PUT
    setAsDefault: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}currencies/${id}/set-as-default`, // PATCH
  },
  business: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}businesses`,
    getAllLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/business`,
    create: `${process.env.NEXT_PUBLIC_API_URL}admin/businesses`,
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/businesses/${id}`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}business/${id}`,
  },
  suppliers: {
    create: `${process.env.NEXT_PUBLIC_API_URL}suppliers`, // POST
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/toggle_state/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/${id}`, // PUT
    evaluations: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/${id}/evaluations`, // GET
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/get_suppliers`, // GET
    pending: `${process.env.NEXT_PUBLIC_API_URL}admin/approval-processes/pending`, // GET
    valid: `${process.env.NEXT_PUBLIC_API_URL}admin/approval-processes/approved`, // GET
  },
  notifications: {
    create: `${process.env.NEXT_PUBLIC_API_URL}admin/notifications`,
    userNotifications: `${process.env.NEXT_PUBLIC_API_URL}admin/user/notifications/`,
    delete: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/notifications/${id}`,
  },
};
