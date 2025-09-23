import React from "react";
import LoaderButton from "@/components/loaders/loader-button";
import {
  FormProvider,
  RHFInputWithLabel,
  RHFSwitch,
} from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import RHFColorPicker from "@/components/react-hook-form/rhf-color-picker";
import { getAllProducts } from "@/services/products";
import { useSectionProductItemAddForm } from "../../hooks/use-section-product-add-form";
import { Product } from "@/types/products";
import ImagePreview from "@/components/image/image-preview";
import LongText from "@/components/long-text/long-text";

type Props = {
  append: any;
};

const SectionProductFrom = ({ append }: Props) => {
  const { form, onSubmit } = useSectionProductItemAddForm(append);

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
          <div>
            <RHFAutocompleteFetcherInfinity
              name={"productGlobalId"}
              label="Producto"
              required
              onFetch={getAllProducts}
              autoFocus
              onOptionSelected={(product: Product) => {
                form.setValue("product", product);
              }}
              renderOption={(product: Product) => (
                <div className="flex flex-row gap-2 items-center">
                  <ImagePreview images={[product.image]} alt={product.name} />
                  <div>
                    <LongText
                      className="text-base"
                      text={product?.name}
                      lineClamp={1}
                    />
                    <LongText
                      className="text-sm font-light"
                      text={product?.description}
                      lineClamp={1}
                    />
                  </div>
                </div>
              )}
            />
          </div>
          {/*  <div>
            <RHFInputWithLabel
              name={"displayOrder"}
              label="Orden de visualización"
              placeholder="Ej: 1,2,3"
              type="number"
            />
          </div> */}

          <div>
            <RHFInputWithLabel
              name={"customLabel"}
              label="Nombre personalizado"
              placeholder="Ej: Oferta del día"
              maxLength={100}
            />
          </div>

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
