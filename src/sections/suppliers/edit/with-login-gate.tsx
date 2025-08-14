"use client";

import { useEffect, useState } from "react";
import WithLoginModal from "@/sections/suppliers/edit/with-login-modal";
import { toast } from "react-toastify";
import { createUserSupplier } from "@/services/supplier";

export default function WithLoginGate({
  supplierState,
  id,
}: {
  id: string;
  supplierState?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const shouldOpen =
      supplierState === "WaitingLogin" || supplierState === "WithLogin";
    setOpen(Boolean(shouldOpen));
  }, [supplierState]);

  const handleSubmit = async (data: {
    changePassword: boolean;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await createUserSupplier(id, data);
      if (res.error) {
        toast.error(res.message || "Error al crear el usuario");
      }
      toast.success("Usuario proveedor creado exitosamente");
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WithLoginModal
      open={open}
      isLoading={isLoading}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
    />
  );
}
