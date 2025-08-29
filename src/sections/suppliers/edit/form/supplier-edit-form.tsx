"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SupplierDetails } from "@/types/suppliers";
import { updateSupplierData } from "@/services/supplier";
import { toast } from "react-toastify";
import SupplierBasicInfo from "./supplier-basic-info";
import SupplierPendingDocuments from "./documents/supplier-pending-documents";
import SupplierApprovedDocuments from "./documents/supplier-approved-documents";
import SupplierEditActions from "./supplier-edit-actions";
import SupplierCategories from "./supplier-categories";
import {
  UpdateSupplierFormData,
  updateSupplierSchemaWithRules,
} from "./schema";

export default function SupplierEditForm({
  supplierDetails,
}: {
  supplierDetails: SupplierDetails;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(updateSupplierSchemaWithRules),
    defaultValues: {
      name: supplierDetails.name,
      email: supplierDetails.email,
      phone: supplierDetails.phone,
      address: supplierDetails.address,
      message: supplierDetails.message || "",
      type: supplierDetails.type,
      isActive: supplierDetails.isActive,
      sellerType: supplierDetails.sellerType ?? "",
      nacionalityType: supplierDetails.nacionality ?? "",
      mincexCode: supplierDetails.mincexCode ?? "",
      expirationDate: supplierDetails.expirationDate
        ? new Date(supplierDetails.expirationDate)
        : undefined,
      pendingCategories:
        supplierDetails.pendingCategories?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          departmentName: cat.departmentName ?? "",
        })) || [],
      approvedCategories:
        supplierDetails.approvedCategories?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          departmentName: cat.departmentName ?? "",
        })) || [],
    },
  });

  const { handleSubmit, reset } = methods;

  // Removed documents prefill; documents now managed outside RHF form

  const onSubmit = async (data: UpdateSupplierFormData) => {
    setIsLoading(true);
    try {
      console.log(data, "Submit");
      const formData = new FormData();
      formData.append("expirationDate", data.expirationDate.toISOString());
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("message", data.message || "");
      formData.append("type", data.type);
      formData.append("isActive", data.isActive.toString());
      formData.append("sellerType", String(data.sellerType));
      formData.append("nacionalityType", String(data.nacionalityType));
      if ((data.mincexCode ?? "").length > 0) {
        formData.append("mincexCode", String(data.mincexCode));
      }
      data.pendingCategories?.forEach((cat) => {
        formData.append("pendingCategoryIds", cat.id.toString());
      });
      data.approvedCategories?.forEach((cat) => {
        formData.append("approvedCategoryIds", cat.id.toString());
      });

      const response = await updateSupplierData(supplierDetails.id, formData);
      if (response.error)
        throw new Error(response.message || "Error al actualizar proveedor");
      toast.success("Solicitud actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      toast.error("Error al actualizar proveedor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SupplierBasicInfo />
          {/* Documents handled outside the RHF form */}
          <SupplierCategories state={supplierDetails.state} />
          <SupplierEditActions isLoading={isLoading} onCancel={handleCancel} />
        </form>
      </FormProvider>
      {/* Standalone document managers */}
      <div className="space-y-6 mt-6">
        <SupplierPendingDocuments
          approvalProcessId={supplierDetails.id}
          initialDocuments={(supplierDetails.pendingDocuments as any) || []}
        />
        {supplierDetails.state !== "Pending" && (
          <SupplierApprovedDocuments
            initialDocuments={(supplierDetails.approvedDocuments as any) || []}
          />
        )}
      </div>
    </>
  );
}
