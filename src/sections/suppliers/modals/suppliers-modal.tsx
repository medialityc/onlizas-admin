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
import {
  SUPPLIER_NATIONALITY,
  SUPPLIER_TYPE,
  SUPPLIER_TYPE_SELLER,
} from "../constants/supplier.options";

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
      countryCode: "",
      address: "",
      documents: [],
      createUserAutomatically: false,
      userId: undefined,
      userMissingEmail: false,
      userMissingPhone: false,
      userMissingAddress: false,
      sellerType: SUPPLIER_TYPE_SELLER.Mayorista,
      nacionalityType: SUPPLIER_NATIONALITY.Nacional,
      mincexCode: "",
      password: "",
      confirmPassword: "",
      supplierType: SUPPLIER_TYPE.Persona,
      // requiredPasswordChange: false,
    },
  });

  const { reset } = methods;
  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };
  const onSubmit = async (data: SuppliersFormData) => {
    // Log de la data antes de enviar
    console.log("[SuppliersModal] Datos a enviar:", data);
    // Si quieres verlo como JSON plano:
    console.log("[SuppliersModal] Datos JSON:", JSON.stringify(data));
    setError(null);

    try {
      const formData = new FormData();
      if (data.createUserAutomatically) {
        if (data.userId !== undefined && data.userId !== null) {
          formData.append("userId", data.userId);
          if (data.email) formData.append("email", data.email);
          if (data.phone) formData.append("phone", data.phone);
          if (data.name) formData.append("name", data.name);
          if (data.countryCode) formData.append("countryId", data.countryCode);
          if (data.address) formData.append("address", data.address);
          formData.append("requirePasswordChange", "false");
        }
      } else {
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.countryCode) formData.append("countryId", data.countryCode);
        if (data.phone) formData.append("phone", data.phone);
        if (data.address) formData.append("address", data.address);
        formData.append("createUserAutomatically", "true");
        if (data.password) {
          formData.append("password", data.password);
        }
      }
      formData.append("sellerType", String(data.sellerType));
      formData.append("nacionality", String(data.nacionalityType));
      formData.append("supplierType", String(data.supplierType));
      if (data.mincexCode) formData.append("mincexCode", data.mincexCode);
      if (data.useExistingBusiness && data.businessId) {
        formData.append("businessId", String(data.businessId));
      }

      data.documents?.forEach((doc) => {
        if (doc.content) {
          formData.append(`contents`, doc.content);
          formData.append(`documentNames`, doc.fileName);
        } else {
          toast.error("El documento debe tener un archivo asociado.");
        }
      });
      // Logging mejorado del FormData (agrupa claves repetidas y muestra metadata de archivos)
      const aggregate: Record<string, any> = {};
      Array.from(formData.entries()).forEach(([key, value]) => {
        const v =
          value instanceof File
            ? { name: value.name, size: value.size, type: value.type }
            : value;
        if (aggregate[key] === undefined) {
          aggregate[key] = v;
        } else if (Array.isArray(aggregate[key])) {
          aggregate[key].push(v);
        } else {
          aggregate[key] = [aggregate[key], v];
        }
      });
      console.log("[SuppliersModal] FormData agregado:", aggregate);
      try {
        console.log(
          "[SuppliersModal] FormData JSON:",
          JSON.stringify(aggregate)
        );
      } catch (e) {
        console.warn("No se pudo serializar FormData agregado", e);
      }
      const response = await createSupplier(formData);

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
