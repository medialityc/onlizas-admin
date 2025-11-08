"use server";

import { backendRoutes } from "@/lib/endpoint";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { ApiResponse } from "@/types/fetch/api";

export interface ExternalReviewEntityDetails {
  name: string;
  email: string;
  state: string;
  isApproved: boolean;
  approvedAt: string | null;
  type?: string;
  sellerType?: string;
  nacionality?: string;
  expirationDate?: string;
  currentRating?: number;
  evaluationCount?: number;
  approvedCategoriesCount?: number;
  requestedCategoriesCount?: number;
}

export interface ExternalReviewResponse {
  valid: boolean;
  status: "ACTIVE" | "EXPIRED" | "REVOKED" | "USED" | "NOT_FOUND";
  entityType: string;
  entityId: string;
  singleUse: boolean;
  maxUses: number;
  uses: number;
  expiresAt: string;
  entityDetails: ExternalReviewEntityDetails;
}

// Approval process review response (new endpoint contract)
export interface ExternalReviewApprovalProcessDocument {
  id: string;
  fileName: string;
  content: string;
  beApproved: boolean;
  rejectionReason: string | null;
}

export interface ExternalReviewApprovalProcessCategory {
  id: string;
  name: string;
  active: boolean;
  departmentId: string;
  departmentName: string;
  description: string;
  image: string;
  features: any[]; // Could refine if needed
}

export interface ExternalReviewApprovalProcessResponse {
  tokenId: string;
  tokenValid: boolean;
  tokenStatus: "ACTIVE" | "EXPIRED" | "REVOKED" | "USED" | "NOT_FOUND";
  tokenSingleUse: boolean;
  tokenMaxUses: number;
  tokenUses: number;
  tokenExpiresAt: string;
  approvalProcess: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    active: boolean;
    isAproved: boolean;
    type: string;
    countryName: string | null;
    nacionality: string;
    businessName: string | null;
    businessCode: string | null;
    sellerType: string;
    mincexCode: string | null;
    expirationDate: string;
    message: string;
    pendingDocuments: ExternalReviewApprovalProcessDocument[];
    approvedDocuments: ExternalReviewApprovalProcessDocument[];
    pendingCategories: ExternalReviewApprovalProcessCategory[];
    approvedCategories: ExternalReviewApprovalProcessCategory[];
    state: string;
    userId: string;
  };
}

// Decision request/response types
export interface ExternalReviewApprovalDecisionRequest {
  token: string;
  approve: boolean;
  comment?: string;
  reviewerEmail?: string;
  reviewerName?: string;
}

export interface ExternalReviewApprovalDecisionResponse {
  approvalProcessId: string;
  isApproved: boolean;
  message: string;
  approvedCategoryCount: number;
  approvedDocumentCount: number;
  tokenStatus: "ACTIVE" | "EXPIRED" | "REVOKED" | "USED" | "NOT_FOUND";
  tokenSingleUse: boolean;
  tokenMaxUses: number | null;
  tokenUses: number;
  tokenExpiresAt: string;
  tokenId: string;
}

export interface ExternalReviewActionRequest {
  token: string;
  action: "APPROVE" | "REJECT" | "COMMENT";
  comment?: string;
  reviewerEmail?: string;
  reviewerName?: string;
}

export async function getExternalReview(
  token: string
): Promise<ApiResponse<ExternalReviewResponse>> {
  const res = await fetch(backendRoutes.externalReview.getByToken(token), {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ExternalReviewResponse>(res);
}

export async function performExternalReviewAction(
  data: ExternalReviewActionRequest
): Promise<ApiResponse<{ status: string }>> {
  const res = await fetch(
    backendRoutes.externalReview.actionByToken(data.token),
    {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: data.action,
        comment: data.comment,
        reviewerEmail: data.reviewerEmail,
        reviewerName: data.reviewerName,
      }),
    }
  );
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}

export async function getExternalReviewApprovalProcess(
  token: string
): Promise<ApiResponse<ExternalReviewApprovalProcessResponse>> {
  const res = await fetch(
    backendRoutes.externalReview.approvalProcessByToken(token),
    {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ExternalReviewApprovalProcessResponse>(res);
}

export async function submitExternalApprovalDecision(
  data: ExternalReviewApprovalDecisionRequest
): Promise<ApiResponse<ExternalReviewApprovalDecisionResponse>> {
  const res = await fetch(
    backendRoutes.externalReview.decisionApprovalProcessByToken(data.token),
    {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approve: data.approve,
        comment: data.comment,
        reviewerEmail: data.reviewerEmail,
        reviewerName: data.reviewerName,
      }),
    }
  );
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ExternalReviewApprovalDecisionResponse>(res);
}

export interface GenerateTokenOptions {
  singleUse?: boolean; // default true when undefined
  maxUses?: number; // only if singleUse === false
  expiryMinutes?: number; // >0
}

export async function generateExternalReviewToken(
  approvalProcessId: string | number,
  opts: GenerateTokenOptions = {}
): Promise<ApiResponse<{ token: string }>> {
  // Build query string with validation
  const params = new URLSearchParams();
  if (opts.singleUse === false) {
    params.set("singleUse", "false");
    if (typeof opts.maxUses === "number" && opts.maxUses > 0) {
      params.set("maxUses", String(opts.maxUses));
    }
  } else if (opts.singleUse === true) {
    // explicit true only if user changed it; backend default might already be true
    params.set("singleUse", "true");
  }
  if (typeof opts.expiryMinutes === "number" && opts.expiryMinutes > 0) {
    params.set("expiryMinutes", String(opts.expiryMinutes));
  }
  const qs = params.toString();
  const base =
    backendRoutes.approvalProcesses.externalReviewToken(approvalProcessId);
  const url = qs ? `${base}?${qs}` : base;
  const res = await nextAuthFetch({
    url,
    method: "POST",
    useAuth: true,
    cache: "no-store",
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}
