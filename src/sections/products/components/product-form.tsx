"use client";
import React, { useCallback, useMemo, useEffect } from "react";
import { useProductCreateForm } from "../hooks/use-product-create-form";
import { useSupplierProductCreateForm } from "../hooks/use-supplier-product-create-form";
import { FormProvider } from "@/components/react-hook-form";

import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";
import { ProductFormData } from "../schema/product-schema";
import LoaderButton from "@/components/loaders/loader-button";
import BasicInfoSection from "./basic-info-section";
import CategoriesAndSuppliersSection from "./categories-suppliers-section";
import ProductDimensionSection from "./product-dimension-section";
import AboutProductSection from "./about-product-section";
import ProductDetailsSection from "./product-details-section";
import { ProductCustomsInfoSection } from "./product-custom-info";
import ProductTutorialsSection from "./product-tutorials-section";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import SupplierSelectProductDraft from "./supplier-select-product-draft";
import SupplierProductSummary from "./supplier-product-summary";

type Props = {
  initValue?: ProductFormData;
  isEdit?: boolean;
};

const ProductForm = ({ initValue }: Props) => {
  const isEdit = useMemo(() => !!initValue?.id, [initValue?.id]);
  const { hasPermission } = usePermissions();

  // Permission logic: Admin (CREATE) vs Supplier (CREATE_PRODUCT)
  const hasAdminCreate = hasPermission([PERMISSION_ENUM.CREATE]);
  const hasSupplierCreate =
    !hasAdminCreate && hasPermission([PERMISSION_ENUM.SUPPLIER_CREATE]);
  const isSupplierMode = hasSupplierCreate && !hasAdminCreate;

  // Initialize both hooks to satisfy React Hook rules, then select
  const supplierHook = useSupplierProductCreateForm(initValue as any, isEdit);
  const adminHook = useProductCreateForm(initValue);
  const hook: any = isSupplierMode ? supplierHook : adminHook;
  const { form, isPending, onSubmit, isDraft } = hook;
  const onSubmitLink =
    isSupplierMode && hook?.onSubmitLink ? hook.onSubmitLink : undefined;

  // Ensure supplier users array is cleared for supplier mode (server assigns current user)
  useEffect(() => {
    if (isSupplierMode) {
      try {
        // Only attempt if field exists in form state (admin schema). Safe no-op otherwise.
        if ((form.getValues() as any)?.supplierUserIds !== undefined) {
          form.setValue("supplierUserIds", [], { shouldDirty: true });
        }
      } catch (_) {}
    }
  }, [isSupplierMode, form]);

  const { push } = useRouter();
  const isProductDraft = [isDraft, isEdit].some(Boolean);

  const handleCancel = useCallback(() => push("/dashboard/products"), [push]);

  // Control de permisos para acciones de submit
  const canSubmit = hasAdminCreate || hasSupplierCreate;

  return (
    <FormProvider methods={form} onSubmit={onSubmit} id="product-form">
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 md:gap-4">
        {!isEdit && isSupplierMode && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <SupplierSelectProductDraft isSupplier={isSupplierMode} />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <SupplierProductSummary
                onSubmitLink={onSubmitLink}
                isLoading={isPending}
              />
            </div>
          </>
        )}
        {(isProductDraft || !isSupplierMode) && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <BasicInfoSection />
            </div>
            <div className="col-span-1 lg:col-span-1 z-10">
              <CategoriesAndSuppliersSection hideSupplier={isSupplierMode} />
            </div>
            <div className="col-span-1 lg:col-span-1">
              <ProductDimensionSection />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <AboutProductSection />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <ProductTutorialsSection />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <ProductDetailsSection />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <ProductCustomsInfoSection />
            </div>
          </>
        )}
      </div>
      {canSubmit && (
        <div className="flex gap-4 pt-6 mt-6 border-t border-gray-400 justify-end">
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          {canSubmit && (
            <LoaderButton
              form="product-form"
              type="submit"
              loading={isPending}
              disabled={isPending}
            >
              {isEdit ? "Actualizar Producto" : "Crear Producto"}
            </LoaderButton>
          )}
        </div>
      )}
    </FormProvider>
  );
};

export default ProductForm;
