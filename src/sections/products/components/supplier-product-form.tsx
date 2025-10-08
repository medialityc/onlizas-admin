"use client";
import React, { useCallback } from "react";
import { FormProvider } from "@/components/react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import BasicInfoSection from "./basic-info-section";
import ProductDimensionSection from "./product-dimension-section";
import AboutProductSection from "./about-product-section";
import ProductDetailsSection from "./product-details-section";
import SupplierSelectProductDraft from "./supplier-select-product-draft";
import { useSupplierProductCreateForm } from "../hooks/use-supplier-product-create-form";
import SupplierProductSummary from "./supplier-product-summary";
import { SupplierProductFormData } from "../schema/supplier-product-schema";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import { ImagesIcon } from "lucide-react";
import IconBox from "@/components/icon/icon-box";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllMeApprovedCategories } from "@/services/categories";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

type Props = {
  initValue?: SupplierProductFormData;
  isEdit?: boolean;
};

const SupplierProductForm = ({ initValue, isEdit }: Props) => {
  const { form, isPending, onSubmit, onSubmitLink, isDraft } =
    useSupplierProductCreateForm(initValue, isEdit);

  const { push } = useRouter();

  const handleCancel = useCallback(() => push("/provider/products"), [push]);

  const isProductDraft = [isDraft, isEdit].some(Boolean);

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE,PERMISSION_ENUM.RETRIEVE_SECTION]);

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="product-form">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 md:gap-4">
          {!isEdit && (
            <>
              <div className="col-span-1 lg:col-span-2">
                <SupplierSelectProductDraft />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <SupplierProductSummary
                  onSubmitLink={onSubmitLink}
                  isLoading={isPending}
                />
              </div>
            </>
          )}

          {isProductDraft && (
            <>
              {/* product form */}
              <div className="col-span-1 lg:col-span-2">
                <BasicInfoSection />
              </div>

              <div className="col-span-1 lg:col-span-2">
                <div className="bg-blur-card flex-1 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <ImagesIcon className="mr-2 w-5 h-5" /> Imágenes
                  </h3>
                  <RHFMultiImageUpload
                    name="additionalImages"
                    label="Imágenes del producto"
                  />
                </div>
              </div>

              <div className="col-span-1 lg:col-span-1">
                <div className="bg-blur-card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <IconBox className="mr-2 w-5 h-5" /> Categorías
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <RHFAutocompleteFetcherInfinity
                        name="categoryIds"
                        label="Categorías"
                        placeholder="Seleccionar categorías..."
                        onFetch={getAllMeApprovedCategories}
                        objectValueKey="id"
                        objectKeyLabel="name"
                        queryKey="categories"
                        required
                        multiple
                      />
                    </div>
                  </div>
                </div>
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
      {isProductDraft && (
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
          {hasUpdatePermission && (
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
    </section>
  );
};

export default SupplierProductForm;
