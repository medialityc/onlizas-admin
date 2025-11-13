export const backendRoutes = {
  brands: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}brands`,
    create: `${process.env.NEXT_PUBLIC_API_URL}brands`,
    getById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}brands/${id}`,
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}brands/${id}`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}brands/${id}`, // DELETE
  },
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
    getById: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}users/${id}`,
    update: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}users/${id}`,
    delete: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}`,
    blockToggle: `${process.env.NEXT_PUBLIC_API_URL}admin/users/block-toggle`,
    updateAttributes: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/attributes`,
    activateUser: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/activate`,
    getAttributeHistory: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/attributes/history`,
    getDocuments: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${id}/documents`,
    getDocumentsById: (userId: number, documentId: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${userId}/documents/${documentId}`,
    uploadDocument: (userId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${userId}/documents`,
    downloadDocument: (userId: number, documentId: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/users/${userId}/documents/${documentId}/download`,
    scan_document: `${process.env.NEXT_PUBLIC_API_URL}users/scan-document`,
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/users`, // GET
    listSuppliers: `${process.env.NEXT_PUBLIC_API_URL}users/suppliers`,
  },
  roles: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}roles`,
    create: `${process.env.NEXT_PUBLIC_API_URL}roles`,
    update: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}roles/${id}`,
    delete: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}roles/${id}`,
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/roles`, // GET
  },
  permissions: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}roles/permissions`,
    create: `${process.env.NEXT_PUBLIC_API_URL}permissions`,
    update: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}permissions/${id}`,
    delete: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}roles/permissions/${id}`,
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/permissions`, // GET
    getBySubsystemId: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}permissions/${id}`,
  },

  categories: {
    create: `${process.env.NEXT_PUBLIC_API_URL}categories`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/categories`, // GET
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/categories`, // GET
    aduanaCategories: `${process.env.NEXT_PUBLIC_API_URL}aduana-categories`,
    toggleStatus: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}/toggle-status`, // TOGGLE STATUS
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, // PUT
    detail: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}categories/admin/${id}`, // GET

    //me
    meApprovedCategories: `${process.env.NEXT_PUBLIC_API_URL}supplier/me/approved-categories`,
  },
  products: {
    create: `${process.env.NEXT_PUBLIC_API_URL}products`, // POST
    list: `${process.env.NEXT_PUBLIC_API_URL}products/admin`, // GET
    listBySupplier: (supplierId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/admin/${supplierId}`, // GET
    byId: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/${id}`, // GET
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/${id}`, // DELETE
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/${id}`, // PUT
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
    categoryFeatures: `${process.env.NEXT_PUBLIC_API_URL}categories/features`, // GET

    toggleActive: (productId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}products/${productId}/toggle-active`,

    /* space SUPPLIER */
    listMyProducts: `${process.env.NEXT_PUBLIC_API_URL}suppliers/products`,
    createSupplierProductByLink: `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/products/link`,
    createSupplierProduct: `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/products`,
    updateSupplierProduct: (productId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/products/${productId}`,
    deleteSupplierProduct: (productId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/products/${productId}`,
    meApprovedProducts: `${process.env.NEXT_PUBLIC_API_URL}products/suppliers/me/products-by-approved-categories`,
    meToggleActive: (productId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/products/${productId}/toggle-active`,
  },
  warehouseVirtualTypes: {
    create: `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types`,
    list: `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types`,
    getById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types/${id}`,
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types/${id}`,
    toggleStatus: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types/${id}/toggle-status`,
    canDelete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types/${id}/can-delete`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}virtual-warehouse-types/${id}`,
  },
  warehouses: {
    create: `${process.env.NEXT_PUBLIC_API_URL}warehouses`,
    list: `${process.env.NEXT_PUBLIC_API_URL}warehouses`,
    edit: (id: string | number, type: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${type}/${id}`,
    updateByType: (id: string | number, type: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${type}/${id}`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${id}`,
    locations: `${process.env.NEXT_PUBLIC_API_URL}warehouses/locations`,
    transfers: `${process.env.NEXT_PUBLIC_API_URL}warehouses/transfers`,
    transferById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/transfers/${id}`,
    listBySupplier: (supplierId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/${supplierId}/warehouses`,
    listByType: (type: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${type}`,
    listSupplier: `${process.env.NEXT_PUBLIC_API_URL}suppliers/warehouses`,
    inventoryList: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${id}/inventory`,
    productList: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${id}/products`,
    variantList: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}warehouses/${id}/variants`,
    metrics: `${process.env.NEXT_PUBLIC_API_URL}warehouses/metrics`,
  },
  warehouse_transfers: {
    create: `${process.env.NEXT_PUBLIC_API_URL}transfers`,
    list: `${process.env.NEXT_PUBLIC_API_URL}transfers`,
    getById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfers/${id}`,
    approve: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfers/${id}/approve`,
    cancel: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfers/${id}/cancel`,
    execute: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfers/${id}/execute`,
    markAwaitingReception: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfers/${id}/mark-awaiting-reception`,
  },
  warehouse_me: {
    create: `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/virtual-warehouses`,
    update: (warehouseId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/virtual-warehouses/${warehouseId}`,
    list: `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/virtual-warehouses`,
    byId: (warehouseId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/me/virtual-warehouses/${warehouseId}`,
  },
  transferReceptions: {
    list: `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions`,
    getById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/${id}`,
    receive: `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/receive`,
    reportDiscrepancy: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/${id}/report-discrepancy`,
    resolveDiscrepancy: (discrepancyId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/${discrepancyId}/resolve-discrepancy`,
    addComment: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/${id}/comments`,
    uploadEvidence: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/${id}/upload-evidence`,
    logs: `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/logs`,
    createInventory: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}transfer-receptions/${id}/create-inventory`,
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
    getByProvider: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}businesses`, // todo pasar id
    getAllLogs: `${process.env.NEXT_PUBLIC_API_URL}logs/business`,
    create: `${process.env.NEXT_PUBLIC_API_URL}admin/businesses`,
    createBySupplier: `${process.env.NEXT_PUBLIC_API_URL}suppliers/businesses`,
    update: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/businesses/${id}`,
    updateProvider: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/businesses/${id}`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}business/${id}`,
    deleteBySupplier: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/businesses/${id}`,
    getAllByUser: `${process.env.NEXT_PUBLIC_API_URL}businesses/mine`,
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
    productsBySupplier: (supplierId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/${supplierId}/products`, // GET
  },
  notifications: {
    create: `${process.env.NEXT_PUBLIC_API_URL}admin/notifications`,
    userNotifications: `${process.env.NEXT_PUBLIC_API_URL}admin/user/notifications/`,
    delete: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/notifications/${id}`,
  },
  documents: {
    validate: (id: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}documents/${id}/validate`, // PUT
    create: `${process.env.NEXT_PUBLIC_API_URL}documents`, // POST
  },
  approvalProcesses: {
    list: `${process.env.NEXT_PUBLIC_API_URL}admin/supplier/me`,
    extend: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}approval-processes/${id}/extend`, // POST
    externalReviewToken: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}admin/approval-process/${id}/external-review-token`, // POST (generate external review token)
  },
  store: {
    create: `${process.env.NEXT_PUBLIC_API_URL}stores/admin`,
    list: `${process.env.NEXT_PUBLIC_API_URL}stores/metrics`,
    listAll: `${process.env.NEXT_PUBLIC_API_URL}stores`,
    listByProvider: (supplierId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/supplier/${supplierId}`,
    listForProvider: `${process.env.NEXT_PUBLIC_API_URL}suppliers/stores`,
    storeById: (storeId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${storeId}`,
    storeDetails: (storeId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/stores/${storeId}`,
    updateSupplierStore: (storeId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/stores/${storeId}`,
    /* updateAdminStore: (storeId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${storeId}`,
 */ createSupplier: (supplierId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}suppliers/${supplierId}/stores`,
    delete: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${id}`,
    details: (storeId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${storeId}`,
    followers: (storeId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${storeId}/followers`,

    // Admin delete
    deleteAdmin: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${id}`,
    update: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${id}`,
    updateAdminStore: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}stores/${id}`,
  },
  storeBanner: {
    create: `${process.env.NEXT_PUBLIC_API_URL}banners`,
    update: `${process.env.NEXT_PUBLIC_API_URL}banners`,
  },
  storeCategories: {
    list: (storeId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}storecategories/${storeId}`,
    order: `${process.env.NEXT_PUBLIC_API_URL}storecategories/order`,
    toggle: `${process.env.NEXT_PUBLIC_API_URL}storecategories/toggle-status`,
  },
  storePromotions: {
    list: () => `${process.env.NEXT_PUBLIC_API_URL}promotions`,
    createGetY: () => `${process.env.NEXT_PUBLIC_API_URL}promotions/buyxgety`,
    updateGetY: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/buyxgety/${promotionId}`,
    createFreeDelivery: () =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/freedelivery`,
    updateFreeDelivery: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/freedelivery/${promotionId}`,
    createAutomatic: () =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/general`,
    updateAutomatic: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/general/${promotionId}`,
    createPackage: () => `${process.env.NEXT_PUBLIC_API_URL}promotions/package`,
    updatePackage: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/package/${promotionId}`,
    createOvervalue: () =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/ordervalue`,
    updateOvervalue: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/ordervalue/${promotionId}`,
    createCode: () => `${process.env.NEXT_PUBLIC_API_URL}promotions/code`,
    updateCode: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/code/${promotionId}`,
    delete: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/${promotionId}`,
    toggle: () => `${process.env.NEXT_PUBLIC_API_URL}promotions/toggle-state`,
    code: () => `${process.env.NEXT_PUBLIC_API_URL}promotions/code/generate`,
    getPromotionById: (promotionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}promotions/${promotionId}`,
  },

  inventoryProvider: {
    create: `${process.env.NEXT_PUBLIC_API_URL}inventories/admin`,
    list: `${process.env.NEXT_PUBLIC_API_URL}inventories/admin`,
    listByProvider: `${process.env.NEXT_PUBLIC_API_URL}suppliers/inventories`,
    delete: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/admin/${id}`,
    removeVariant: (inventoryId: number | string, variantId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/remove-variant/${inventoryId}/${variantId}`,
    listByUserProvider: (supplierId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/admin/list/${supplierId}`,

    getById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/admin/${id}`,

    updateById: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/admin/${id}/variants`,
    AddVariantToInventory: (inventoryId: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/${inventoryId}/variants`,
    editVariantInventory: (id: string | number) =>
      `${process.env.NEXT_PUBLIC_API_URL}inventories/variants/${id}`,

    variantByCategory: `${process.env.NEXT_PUBLIC_API_URL}inventories/variants/by-categories`,
    variantBySupplier: `${process.env.NEXT_PUBLIC_API_URL}inventories/variants/by-supplier`,
  },
  regions: {
    listById: (regionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/config`,
    delete: (regionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}`,
    update: (regionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}`,
    get: `${process.env.NEXT_PUBLIC_API_URL}regions`,
    create: `${process.env.NEXT_PUBLIC_API_URL}regions`,

    // Currency configuration endpoints
    currencies: {
      add: (regionId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/currencies`,
      remove: (regionId: number | string, currencyId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/currencies/${currencyId}`,
      setPrimary: (regionId: number | string, currencyId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/currencies/${currencyId}/primary`,
    },

    // Payment configuration endpoints
    payments: {
      add: (regionId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/payment-gateways`,
      remove: (regionId: number | string, gatewayId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/payment-gateways/${gatewayId}`,
      updatePriority: (regionId: number | string, gatewayId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/payment-gateways/${gatewayId}/priority`,
    },

    // Shipping configuration endpoints
    shipping: {
      add: (regionId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/shipping-methods`,
      remove: (regionId: number | string, shippingId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/shipping-methods/${shippingId}`,
      get: (regionId: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/shipping-methods`,
    },

    // Logs endpoints
    getAllLogs: `${process.env.NEXT_PUBLIC_API_URL}regions/logs`,
    getLogsByRegion: (regionId: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}regions/${regionId}/logs`,
  },
  locations: {
    list: `${process.env.NEXT_PUBLIC_API_URL}locations`,
    getById: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}locations/${id}`,
    create: `${process.env.NEXT_PUBLIC_API_URL}locations`,
    update: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}locations/${id}`,
    delete: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}locations/${id}`,
    toggleStatus: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}locations/${id}/toggle-status`, // PATCH
    listLogs: `${process.env.NEXT_PUBLIC_API_URL}locations/logs`, // GET
    getLogsById: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}locations/${id}/logs`, // GET
  },
  systemConfigurations: {
    list: `${process.env.NEXT_PUBLIC_API_URL}system-configuration`,
    update: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}system-configuration/${id}`,
    setCurrent: (id: number | string) =>
      `${process.env.NEXT_PUBLIC_API_URL}system-configuration/${id}/current`,
    create: `${process.env.NEXT_PUBLIC_API_URL}system-configuration`,
  },

  content: {
    section: {
      list: `${process.env.NEXT_PUBLIC_API_URL}admin/sections`, // GET
      create: `${process.env.NEXT_PUBLIC_API_URL}admin/sections`, // POST
      getOne: (id: string | number) =>
        `${process.env.NEXT_PUBLIC_API_URL}admin/sections/${id}`, // GET
      delete: (id: number | string) =>
        `${process.env.NEXT_PUBLIC_API_URL}admin/sections/${id}`, // DELETE
      update: (id: string | number) =>
        `${process.env.NEXT_PUBLIC_API_URL}admin/sections/${id}`, // PUT
      rollBack: (id: string | number, versionId: string | number) =>
        `${process.env.NEXT_PUBLIC_API_URL}admin/sections/${id}/rollback/${versionId}`, // POST
    },
    homeBanner: {
      list: `${process.env.NEXT_PUBLIC_API_URL}home-banners`, // GET
      create: `${process.env.NEXT_PUBLIC_API_URL}home-banners/create`, // POST
      getOne: (id: string | number) =>
        `${process.env.NEXT_PUBLIC_API_URL}home-banners/${id}`, // GET
      delete: `${process.env.NEXT_PUBLIC_API_URL}home-banners/soft-delete`, // DELETE
      update: `${process.env.NEXT_PUBLIC_API_URL}home-banners/update`, // PUT

      searchByStore: (storeId: string | number) =>
        `${process.env.NEXT_PUBLIC_API_URL}home-banners/${storeId}`, // GET
      searchAdminByStore: (storeId: string | number) =>
        `${process.env.NEXT_PUBLIC_API_URL}home-banners/admin/${storeId}`, // GET
      toggleStatus: `${process.env.NEXT_PUBLIC_API_URL}home-banners/toggle-status`, // TOGGLE STATUS
    },
  },
  unit: {
    list: `${process.env.NEXT_PUBLIC_API_URL}units`,
  },

  subsystems: {
    create: `${process.env.NEXT_PUBLIC_API_URL}sub-systems`,
    delete: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${id}`,
    updateAttributes: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${id}/attributes`,
    getAttributeHistory: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${id}/attributes/history`,
    deleteUser: (userId: string, businessId: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${businessId}/users/${userId}`,
    update: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${id}`,
    activate: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${id}/activate`,
    getAll: `${process.env.NEXT_PUBLIC_API_URL}subsystems`,
    addBusinesses: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}sub-systems/${id}/businesses`,
  },
  externalReview: {
    // Nuevo contrato: GET /external-review/{token} y POST /external-review/{token}/action
    getByToken: (token: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}external-review/${token}`,
    actionByToken: (token: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}external-review/${token}/action`,
    approvalProcessByToken: (token: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}external-review/${token}/approval-process`,
    decisionApprovalProcessByToken: (token: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}external-review/${token}/approval-process/decision`,
  },
};
