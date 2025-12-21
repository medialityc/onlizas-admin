export interface RecentActivityAdmin {
  type: string;
  description: string;
  timestamp: string;
  userName: string;
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  suppliersCount: number;
  importersCount: number;
  totalProducts: number;
  activeProducts: number;
  productsWithStock: number;
  productsOutOfStock: number;
  totalOrders: number;
  ordersThisMonth: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalStores: number;
  activeStores: number;
  pendingApprovalStores: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  totalWarehouses: number;
  lowStockAlerts: number;
  totalReviews: number;
  pendingReviews: number;
  averageRating: number;
  recentActivities: RecentActivityAdmin[];
}

export interface ApprovalStatus {
  isApproved: boolean;
  state: string;
  approvedAt: string;
  expirationDate: string;
  approvedCategoriesCount: number;
  currentRating: number;
}

export interface RecentActivitySupplier {
  type: string;
  description: string;
  timestamp: string;
  reference: string;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  productImage: string;
  salesCount: number;
  totalRevenue: number;
}

export interface SupplierDashboard {
  totalProducts: number;
  activeProducts: number;
  productsWithStock: number;
  productsOutOfStock: number;
  pendingApprovalProducts: number;
  totalInventories: number;
  activeInventories: number;
  lowStockAlerts: number;
  totalOrders: number;
  ordersThisMonth: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalStores: number;
  activeStores: number;
  totalReviews: number;
  averageRating: number;
  reviewsThisMonth: number;
  approvalStatus: ApprovalStatus;
  recentActivities: RecentActivitySupplier[];
  topSellingProducts: TopSellingProduct[];
}
