"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  SUPPLIER_NATIONALITY,
  SUPPLIER_TYPE,
  SUPPLIER_TYPE_SELLER,
} from "../../constants/supplier.options";

export default function SupplierEditForm({
  supplierDetails,
}: {
  supplierDetails: SupplierDetails;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const initValue = useMemo(
    () => ({
      name: supplierDetails.name,
      email: supplierDetails.email,
      phone: supplierDetails.phone,
      countryCode: supplierDetails.countryCode ?? "",
      address: supplierDetails.address,
      message: supplierDetails.message || "",
      active: supplierDetails.active,
      sellerType: supplierDetails.sellerType
        ? Number(SUPPLIER_TYPE_SELLER[supplierDetails.sellerType])
        : 0,
      nacionalityType: supplierDetails.nacionality
        ? Number(SUPPLIER_NATIONALITY[supplierDetails.nacionality])
        : 0,
      mincexCode: supplierDetails.mincexCode ?? "",
      supplierType: supplierDetails.type
        ? Number(SUPPLIER_TYPE[supplierDetails.type])
        : 0,
      expirationDate: supplierDetails.expirationDate
        ? new Date(supplierDetails.expirationDate)
        : new Date(),
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
    }),
    [supplierDetails]
  );
  const methods = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(updateSupplierSchemaWithRules) as any,
    defaultValues: initValue,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (initValue) {
      reset(initValue);
    }
  }, [initValue, reset]);

  // Removed documents prefill; documents now managed outside RHF form
  console.log(methods.formState.errors);
  const onSubmit = async (data: UpdateSupplierFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "expirationDate",
        data?.expirationDate?.toISOString() || new Date().toISOString()
      );
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.countryCode) {
        formData.append("countryCode", data.countryCode);
      }
      formData.append("address", data.address);
      formData.append("message", data.message || "");
      formData.append("active", data.active.toString());
      formData.append("sellerType", String(data.sellerType));
      formData.append("nacionalityType", String(data.nacionalityType));
      formData.append("supplierType", String(data.supplierType));
      if (data.mincexCode) {
        console.log(data.mincexCode);

        formData.append("mincexCode", data.mincexCode);
      }
      data.pendingCategories?.forEach((cat) => {
        formData.append("pendingCategoryIds", cat.id.toString());
      });
      data.approvedCategories?.forEach((cat) => {
        formData.append("approvedCategoryIds", cat.id.toString());
      });
      formData.append("approvalProcessId", supplierDetails.id);

      const response = await updateSupplierData(
        supplierDetails.userId,
        formData
      );
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
