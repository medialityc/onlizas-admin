export type SelectedAccount = { accountId: string; supplierId: string | null };

export type Supplier = {
  userId: string;
  userName: string;
  email?: string;
  totalPendingAccounts?: number;
  totalPendingAmount?: number;
  accounts?: Account[];
};

export type Account = {
  accountId: string;
  supplierId?: string | null;
  supplierName?: string | null;
  description?: string;
  dueDate?: string | Date;
  orderIds?: string[];
  subOrdersCount?: number;
  productAmount?: number;
  deliveryAmount?: number;
  taxAmount?: number;
  platformFeeAmount?: number;
  supplierAmount?: number;
  totalAmount?: number;
};
