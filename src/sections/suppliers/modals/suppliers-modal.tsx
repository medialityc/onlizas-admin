"use client";

import { AlertBox } from "@/components/alert/alert-box";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  SuppliersFormData,
  suppliersSchemaWithRules,
} from "./suppliers-schema";

import { Supplier } from "@/types/suppliers";
import { createSupplier } from "@/services/supplier";
import SupplierCreateForm from "./supplier-create-form";
import { redirect } from "next/dist/server/api-utils";

interface SuppliersModalProps {
  open: boolean;
  onClose: () => void;
  supplier?: Supplier; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function SuppliersModal({
  open,
  onClose,
  loading,
  onSuccess,
}: SuppliersModalProps) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SuppliersFormData>({
    resolver: zodResolver(suppliersSchemaWithRules),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      documents: [],
      useExistingUser: false,
      userId: undefined,
      userMissingEmail: false,
      userMissingPhone: false,
      userMissingAddress: false,
      sellerType: "",
      nacionalityType: "",
      mincexCode: "",
      password: "",
      confirmPassword: "",
      requiredPasswordChange: false,
    },
  });

  const { reset } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: SuppliersFormData) => {
    setError(null);
    try {
      const formData = new FormData();

      if (data.useExistingUser) {
        if (data.userId !== undefined && data.userId !== null) {
          formData.append("userId", String(data.userId));
          if (data.email) formData.append("email", data.email);
          if (data.phone) formData.append("phone", data.phone);
          if (data.address) formData.append("address", data.address);
          formData.append("createUserAutomatically", "false");
          formData.append("requirePasswordChange", "false");
        }
      } else {
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.address) formData.append("address", data.address);
        formData.append("createUserAutomatically", "true");
        formData.append(
          "requirePasswordChange",
          data.requiredPasswordChange ? "true" : "false"
        );
        if (data.password) {
          formData.append("password", data.password);
        }
      }

      // Enums y condicionales
      formData.append("sellerType", String(data.sellerType));
      formData.append("nacionalityType", String(data.nacionalityType));
      if (data.mincexCode) formData.append("mincexCode", data.mincexCode);

      // Agregar documentos como array de objetos
      data.documents?.forEach((doc) => {
        if (doc.content) {
          formData.append(`contents`, doc.content);
          formData.append(`documentNames`, doc.fileName);
        } else {
          toast.error("El documento debe tener un archivo asociado.");
        }
      });

      const response = await createSupplier(formData);
      console.log(response);

      if (response && !response.error) {
        onSuccess?.();
        reset();
        toast.success("Proveedor creado exitosamente");
        handleClose();
      } else {
        toast.error(response.message ?? "Error al crear el proveedor");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el proveedor";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      className="max-w-2xl"
      title={"Crear Nuevo Proveedor"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <SupplierCreateForm handleClose={handleClose} />
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
