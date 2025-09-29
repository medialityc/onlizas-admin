"use client";
import React, { useState } from "react";

import LoaderButton from "@/components/loaders/loader-button";
import { FormProvider, RHFSwitch } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import RHFColorPicker from "@/components/react-hook-form/rhf-color-picker";
import { useSectionProductItemAddForm } from "../../hooks/use-section-product-add-form";
import ImagePreview from "@/components/image/image-preview";
import LongText from "@/components/long-text/long-text";
import { getAllCategories } from "@/services/categories";
import {
  getAllInventoryVariantsByCategories,
  getAllInventoryVariantsBySupplier,
} from "@/services/inventory-providers";
import { Category } from "@/types/categories";
import CustomChipItem from "@/components/custom-chip-item";
import { ProductVariant } from "@/sections/inventory-provider/schemas/inventory-provider.schema";
import { isValidUrl } from "@/utils/format";
import { InventoryProductItem } from "@/types/inventory";
import { SectionProductItemFormData } from "../../schema/section-schema";
import TabsWithIcons from "@/components/tab/tabs";
import { Boxes, UsersRound } from "lucide-react";
import { Supplier } from "@/types/suppliers";
import { getAllSuppliers } from "@/services/supplier";

type Props = {
  append: any;
};

const SectionProductFrom = ({ append }: Props) => {
  const [variants, setVariants] = useState<InventoryProductItem[] | null>(null);
  const [category, setCategory] = useState<number[] | null>(null);
  const [supplier, setSupplier] = useState<number | null>(null);

  const addProduct = (values: SectionProductItemFormData) => {
    variants?.forEach((variant) => {
      append({
        customBackgroundColor: values.customBackgroundColor,
        customLabel: variant?.productName || "",
        productGlobalId: variant.globalID,
        displayOrder: values.displayOrder,
        isFeatured: values.isFeatured,
        product: variant,
      });
    });
  };

  const { form, onSubmit } = useSectionProductItemAddForm(addProduct);

  // Limpiar productos seleccionados y variants cada vez que cambia supplier
  React.useEffect(() => {
    setVariants(null);
    form.resetField("products");
  }, [supplier, form]);

  return (
    <section>
      <FormProvider
        methods={form}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          onSubmit();
        }}
        id="section-product-item-form"
      >
        <div className="flex flex-col gap-4">
          <TabsWithIcons
            tabListClassName="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg"
            handleChange={() => {
              setVariants(null);
              setCategory(null);
              setSupplier(null);
              form.resetField("products");
              form.resetField("categoriesIds");
              form.resetField("supplierId");
            }}
            tabs={[
              {
                icon: <Boxes />,
                label: "Filtrar por categoría",
                content: (
                  <>
                    <RHFAutocompleteFetcherInfinity
                      name={"categoriesIds"}
                      label="Categorías"
                      required
                      onFetch={getAllCategories}
                      autoFocus
                      multiple
                      onOptionSelected={(c: Category) => {
                        setCategory((prev) => {
                          const newArr = prev ? [...prev, c.id] : [c.id];
                          return newArr;
                        });
                      }}
                      renderMultiplesValues={(
                        selectedOptions,
                        removeSelected
                      ) => (
                        <CustomChipItem
                          selectedOptions={selectedOptions}
                          removeSelected={(option) => {
                            removeSelected(option);
                            setCategory((prev) => {
                              const newArr = prev
                                ? prev.filter((id) => id !== option.id)
                                : null;
                              return newArr;
                            });
                          }}
                        />
                      )}
                    />

                    {category && (
                      <RHFAutocompleteFetcherInfinity
                        key={JSON.stringify(category)}
                        objectKeyLabel={"productName"}
                        objectValueKey={"id"}
                        name={"products"}
                        label="Producto"
                        multiple
                        required
                        onFetch={getAllInventoryVariantsByCategories}
                        extraFilters={{ categoriesIds: category }}
                        autoFocus
                        onOptionSelected={(product: InventoryProductItem) => {
                          setVariants((prev) => {
                            const newArr = prev
                              ? [...prev, product]
                              : [product];
                            return newArr;
                          });
                        }}
                        renderOption={(option: InventoryProductItem) => {
                          const variant = option as unknown as ProductVariant;
                          return (
                            <div className="flex flex-row gap-2 items-center">
                              <ImagePreview
                                previewEnabled={false}
                                images={
                                  variant.images?.map((img: string | File) =>
                                    typeof img === "string" && isValidUrl(img)
                                      ? img
                                      : ""
                                  ) ?? []
                                }
                                alt={variant.productName ?? "product"}
                              />
                              <div>
                                <LongText
                                  className="text-base"
                                  text={variant?.productName ?? ""}
                                  lineClamp={1}
                                />
                                <LongText
                                  className="text-sm font-light"
                                  text={variant?.storeName ?? ""}
                                  lineClamp={1}
                                />
                              </div>
                            </div>
                          );
                        }}
                      />
                    )}
                  </>
                ),
              },
              {
                icon: <UsersRound />,
                label: "Filtrar por proveedor",
                content: (
                  <>
                    <RHFAutocompleteFetcherInfinity
                      name={"supplierId"}
                      label="Proveedor"
                      required
                      onFetch={getAllSuppliers}
                      autoFocus
                      onOptionSelected={(s: Supplier) => {
                        setSupplier((prev) => {
                          // Si cambia el supplier, limpia productos seleccionados
                          if (prev !== s.id) {
                            setVariants(null);
                            form.resetField("products");
                          }
                          return s.id;
                        });
                      }}
                    />

                    {supplier !== null && (
                      <RHFAutocompleteFetcherInfinity
                        key={`supplier-${supplier}`}
                        objectKeyLabel={"productName"}
                        objectValueKey={"id"}
                        name={"products"}
                        label="Producto"
                        multiple
                        required
                        onFetch={getAllInventoryVariantsBySupplier}
                        extraFilters={{ supplierId: supplier }}
                        autoFocus
                        onOptionSelected={(product: InventoryProductItem) => {
                          setVariants((prev) => {
                            const newArr = prev
                              ? [...prev, product]
                              : [product];
                            return newArr;
                          });
                        }}
                        renderOption={(option: InventoryProductItem) => {
                          const variant = option as unknown as ProductVariant;
                          return (
                            <div className="flex flex-row gap-2 items-center">
                              <ImagePreview
                                previewEnabled={false}
                                images={
                                  variant.images?.map((img: string | File) =>
                                    typeof img === "string" && isValidUrl(img)
                                      ? img
                                      : ""
                                  ) ?? []
                                }
                                alt={variant.productName ?? "product"}
                              />
                              <div>
                                <LongText
                                  className="text-base"
                                  text={variant?.productName ?? ""}
                                  lineClamp={1}
                                />
                                <LongText
                                  className="text-sm font-light"
                                  text={variant?.storeName ?? ""}
                                  lineClamp={1}
                                />
                              </div>
                            </div>
                          );
                        }}
                      />
                    )}
                  </>
                ),
              },
            ]}
          />

          {/*  <div>
            <RHFInputWithLabel
              name={"customLabel"}
              label="Nombre personalizado"
              placeholder="Ej: Oferta del día"
              maxLength={100}
            />
          </div> */}

          {/* personalice */}

          <RHFColorPicker
            name={"customBackgroundColor"}
            label="Color de fondo personalizado"
          />

          <RHFSwitch name={"isFeatured"} label="Destacado" />
          {/* actions */}
          <div className="flex justify-end gap-3 pt-2">
            <LoaderButton
              type="button"
              className="btn btn-primary "
              onClick={() => onSubmit()}
            >
              Adicionar
            </LoaderButton>
          </div>
        </div>
      </FormProvider>
    </section>
  );
};
export default SectionProductFrom;
