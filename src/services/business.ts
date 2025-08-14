"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { Business, GetAllBusiness } from "@/types/business";

// Mock data for testing
/* const mockBusinesses: Business[] = [
  {
    id: 1,
    code: "BUS001",
    name: "ZAS Express Main",
    description: "Main logistics and transport business",
    locationId: "LOC001",
    initialHbl: "HBL2024001",
    address: "Main Ave 123, City",
    email: "contact@zasexpress.com",
    phone: "+1234567890",
    isPrimary: true,
    fixedRate: 150.5,
    invoiceText: "Thank you for your preference",
    users: [1, 2, 3],
    childBusinessIds: [2],
    photos: [],
    parentBusiness: 0
  },
  {
    id: 2,
    code: "BUS002",
    name: "ZAS Express North Branch",
    description: "Branch specialized in international shipments",
    locationId: "LOC002",
    initialHbl: "HBL2024002",
    address: "North Street 456, City",
    email: "north@zasexpress.com",
    phone: "+1234567891",
    isPrimary: false,
    fixedRate: 120.0,
    invoiceText: "Specialized service in international shipments",
    users: [4, 5],
    parentBusiness: 1,
    childBusinessIds: [],
    photos: [
      
    ],
  },
]; */

export async function getAllBusiness(
  params: IQueryable
): Promise<ApiResponse<GetAllBusiness>> { 
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.business.getAll
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["business"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllBusiness>(res);
}

export async function createBusiness(
  data: FormData
): Promise<ApiResponse<Business>> {
  console.log("Creating business with data:");
  const res = await nextAuthFetch({
      url: backendRoutes.business.create,
      method: "POST",
      data,
      useAuth: true,
    });
  
    if (!res.ok) return handleApiServerError(res);
    revalidateTag("categories");
  
    return buildApiResponseAsync<Business>(res);
  
  
}

export async function updateBusinessData(
  id: string | number,
  data: FormData
): Promise<ApiResponse<Business>> {
  // TODO: Implement real backend call when available
  console.log(
    "Updating business with id:",
    id,
    "data:",
    Object.fromEntries(data)
  );
  return {
    data: {} as Business,
    error: false,
    status: 200,
    message: "Business updated (mock)",
  };
}

export async function deleteBusiness(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  // TODO: Implement real backend call when available
  console.log("Deleting business with id:", id);
  return {
    data: { status: 200 } as ApiStatusResponse,
    error: false,
    status: 200,
    message: "Business deleted (mock)",
  };
}

/* export async function getBusinessDetails(
  id: string | number
): Promise<ApiResponse<Business>> {  
  console.log("Fetching business details for id:", id);
  const business = mockBusinesses.find((b) => b.id === Number(id));
  if (!business) {
    return {
      data: {} as Business,
      error: true,
      status: 404,
      message: "Business not found",
    };
  }
  return {
    data: business,
    error: false,
    status: 200,
  };
} */
