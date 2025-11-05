"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteVariantInventory } from "@/services/inventory-providers";

export const useInventoryVariantDelete = (
  inventoryId: string
  // onRemove: () => void
) => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (variantId: string) => {
      const res = await deleteVariantInventory(inventoryId, variantId);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(`Se eliminó la variante de el inventario correctamente`);
      // onRemove();
    },
    onError: (error: unknown) => {
      let msg = "Ocurrió un error al guardar el inventario";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      toast.error(msg);
    },
  });

  return {
    isPending,
    onDelete: mutateAsync,
    mutate,
  };
};
