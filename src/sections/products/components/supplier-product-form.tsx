"use client";
import React, { useCallback, useMemo } from "react";
import { FormProvider } from "@/components/react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";
import { ProductFormData } from "../schema/product-schema";
import LoaderButton from "@/components/loaders/loader-button";
import BasicInfoSection from "./basic-info-section";
import CategoriesAndSuppliersSection from "./categories-suppliers-section";
import ProductDimensionSection from "./product-dimension-section";
import AboutProductSection from "./about-product-section";
import ProductDetailsSection from "./product-details-section";
import SupplierSelectProductDraft from "./supplier-select-product-draft";
import { useSupplierProductCreateForm } from "../hooks/use-supplier-product-create-form";
import SupplierProductSummary from "./supplier-product-summary";

type Props = {
  initValue?: ProductFormData;
};

const SupplierProductForm = ({ initValue }: Props) => {
  const { form, isPending, onSubmit, onSubmitLink, isDraft } =
    useSupplierProductCreateForm(initValue);

  const { push } = useRouter();

  const isEdit = useMemo(() => !!initValue?.id, [initValue?.id]);

  const handleCancel = useCallback(() => push("/provider/products"), [push]);

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="product-form">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 md:gap-4">
          <div className="col-span-1 lg:col-span-2">
            <SupplierSelectProductDraft />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <SupplierProductSummary
              onSubmitLink={onSubmitLink}
              isLoading={isPending}
            />
          </div>

          {isDraft && (
            <>
              {/* product form */}
              <div className="col-span-1 lg:col-span-2">
                <BasicInfoSection />
              </div>

              <div className="col-span-1 lg:col-span-1">
                <CategoriesAndSuppliersSection hideSupplier />
              </div>
              <div className="col-span-1 lg:col-span-1">
                <ProductDimensionSection />
              </div>

              <div className="col-span-1 lg:col-span-2">
                <AboutProductSection />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <ProductDetailsSection />
              </div>
            </>
          )}
        </div>
      </FormProvider>
      {/* Botones de acción */}
      {isDraft && (
        <div
          className={cn(
            "flex gap-4 pt-6 mt-6 border-t dark:border-slate-700 justify-end"
          )}
        >
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <LoaderButton
            form="product-form"
            type="submit"
            loading={isPending}
            disabled={isPending}
          >
            {isEdit ? "Actualizar Producto" : "Crear Producto"}
          </LoaderButton>
        </div>
      )}
    </section>
  );
};

export default SupplierProductForm;
