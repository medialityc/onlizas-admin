"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GeneratePartialClosureInput, RetryPaymentInput } from "../schemas";

// Placeholder fetchers; replace with services under src/services
async function fetchClosures(params: any) {
  return { items: [], total: 0 };
}
async function fetchPayRecv(params: any) {
  return { items: [], total: 0 };
}
async function generatePartialClosure(input: GeneratePartialClosureInput) {
  return { ok: true } as const;
}
async function retryPayment(input: RetryPaymentInput) {
  return { ok: true } as const;
}

export function useClosuresList(params: any) {
  return useQuery({
    queryKey: ["finance", "closures", params],
    queryFn: () => fetchClosures(params),
  });
}
export function usePayRecvList(params: any) {
  return useQuery({
    queryKey: ["finance", "payrecv", params],
    queryFn: () => fetchPayRecv(params),
  });
}
export function useGeneratePartialClosure() {
  return useMutation({
    mutationKey: ["finance", "generate-partial"],
    mutationFn: generatePartialClosure,
  });
}
export function useRetryPayment() {
  return useMutation({
    mutationKey: ["finance", "retry-payment"],
    mutationFn: retryPayment,
  });
}
