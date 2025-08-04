export const backendRoutes = {
  countries: { get: `${process.env.NEXT_PUBLIC_API_URL}countries` },
  users: {
    me: `${process.env.NEXT_PUBLIC_API_URL}users/me`,
    resendEmail: `${process.env.NEXT_PUBLIC_API_URL}users/me/email/resend-verification`,
    resendPhone: `${process.env.NEXT_PUBLIC_API_URL}users/me/phone/resend-verification`,
    getAll: `${process.env.NEXT_PUBLIC_API_URL}admin/users`,
    create: `${process.env.NEXT_PUBLIC_API_URL}admin/users`,
    getById: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}`,
    update: `${process.env.NEXT_PUBLIC_API_URL}admin/users`,
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
  },
  roles: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}roles`,
    create: `${process.env.NEXT_PUBLIC_API_URL}roles`,
    update: (id: number) => `${process.env.NEXT_PUBLIC_API_URL}roles/${id}`,
    delete: (id: number) => `${process.env.NEXT_PUBLIC_API_URL}roles/${id}`,
  },
  permissions: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}roles/permissions`,
    create: `${process.env.NEXT_PUBLIC_API_URL}roles/permissions`,
    update: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}roles/permissions/${id}`,
    delete: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}roles/permissions/${id}`,
  },
  categories: {
    create: `${process.env.NEXT_PUBLIC_API_URL}categories`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/categories`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, // PUT
  },
  products: {
    create: `${process.env.NEXT_PUBLIC_API_URL}products`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}products`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/${id}`, // PUT
    import: `${process.env.NEXT_PUBLIC_API_URL}products/import`,
  },
  departments: {
    create: `${process.env.NEXT_PUBLIC_API_URL}departments`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/departments`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}departments/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}departments/${id}`, // PUT
  },
};
