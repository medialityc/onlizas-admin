"use client";

import { getCategoryFeatures } from "@/services/products";
import { useMutation } from "@tanstack/react-query";

export const useFindFeatureCategory = () => {
  return useMutation({
    mutationFn: (category: number[]) => getCategoryFeatures(category),
    mutationKey: ["categories-feature"],
  });
};
