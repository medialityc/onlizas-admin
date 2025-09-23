"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { HomeBannerFormData } from "../schema/banner-schema";
import { useHomeBannerCreateForm } from "../hooks/use-banner-create-form";

import { RHFCheckbox } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getRegions } from "@/services/regions";

interface Props {
  initValue?: HomeBannerFormData;
}

export default function HomeBannerForm({ initValue }: Props) {
  const { form, isPending, onSubmit } = useHomeBannerCreateForm(initValue);
  const { push } = useRouter();
  const handleCancel = useCallback(
    () => push("/dashboard/content/home-banners"),
    [push]
  );

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="home-banner-from">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="col-span-1">
            <RHFAutocompleteFetcherInfinity
              name="regionId"
              label="Tienda"
              required
              onFetch={async (params) => {
                const result = await getRegions(params);
                return {
                  ...result,
                  data: result.data
                    ? {
                        data: result.data,
                        totalCount: result.data.length,
                        page: params?.page ?? 1,
                        pageSize: params?.pageSize ?? result.data.length,
                        totalPages: 1,
                        hasNextPage: false,
                      }
                    : undefined,
                } as any;
              }}
              // multiple
            />
          </div>

          <div className="col-span-1">
            <RHFInputWithLabel
              name="link"
              label="Url del banner"
              placeholder="Ej: /departments/1"
              autoFocus
              maxLength={100}
            />
          </div>

          {/* <div className="col-span-1">
            <RHFInputWithLabel
              name="position"
              label="Posición"
              placeholder="Ej: 1,2,3"
              type="number"
            />
          </div> */}
          {/*  <div className="col-span-1">
            <RHFDateInput
              minDate={new Date()}
              name="initDate"
              label="Fecha de inicio"
            />
          </div>
          <div className="col-span-1">
            <RHFDateInput
              minDate={initDate}
              name="endDate"
              label="Fecha de expiración"
            />
          </div> */}
          <div className="col-span-1 md:col-span-2">
            <RHFCheckbox name="isActive" label="Activar banner" />{" "}
          </div>
          <div className="col-span-1">
            <RHFImageUpload
              name="imageDesktopUrl"
              label="Imagen para computadoras"
              variant="rounded"
              size="full"
              cropDimensions={{
                height: 557,
                width: 1920,
              }}
            />
          </div>
          <div className="col-span-1">
            <RHFImageUpload
              name="imageMobileUrl"
              label="Imagen para dispositivos mobiles"
              variant="rounded"
              size="full"
              cropDimensions={{
                height: 730,
                width: 470,
              }}
            />
          </div>
        </div>
      </FormProvider>

      {/* actions */}
      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          outline
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <LoaderButton
          type="submit"
          form="home-banner-from"
          loading={isPending}
          disabled={isPending}
          className="btn btn-primary "
        >
          Guardar
        </LoaderButton>
      </div>
    </section>
  );
}
