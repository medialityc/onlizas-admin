"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";
import { PaginatedResponse } from "@/types/common";

export type AccountSummaryItem = {
  accountId: string;
  description: string;
  totalAmount: number;
  createdDate: string;
  dueDate: string;
  paymentDate: string | null;
  status: number;
  statusName: string;
  typeForUser: number;
  typeForUserName: string;
  subOrdersCount: number;
  closureId: string | null;
  user: {
    userId: string;
    userName: string;
    email: string;
  };
  orderIds: string[];
  productAmount: number;
  platformFeeAmount: number;
  supplierAmount: number;
  deliveryAmount: number;
  taxAmount: number;
};

export async function getApprovalAccountsSummary(
  params: IQueryable
): Promise<ApiResponse<PaginatedResponse<AccountSummaryItem>>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    `${process.env.NEXT_PUBLIC_API_URL}approval/accounts/summary`
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["approval-accounts-summary"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PaginatedResponse<AccountSummaryItem>>(res);
}
