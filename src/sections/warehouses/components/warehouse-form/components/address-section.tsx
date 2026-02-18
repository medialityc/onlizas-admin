"use client";

import RHFInput from "@/components/react-hook-form/rhf-input";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getDistrictsByCountry } from "@/services/districts";
import { useFormContext } from "react-hook-form";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";

type Props = { showCountryAndDistrict?: boolean };

export default function AddressSection({
  showCountryAndDistrict = true,
}: Props) {
  const { watch } = useFormContext();
  const countryIdFromForm = watch("address.countryId");
  const countryId = countryIdFromForm;

  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-100" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-none">
            Dirección
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {showCountryAndDistrict && (
          <div className="space-y-4 mt-[3px]">
            <RHFCountrySelect
              name="address.countryId"
              variant="name"
              label="País"
              placeholder="Selecciona un país"
              required
              fullwidth
            />
          </div>
        )}
        <RHFAutocompleteFetcherInfinity
          key={`districts-${countryId}`}
          name="address.districtId"
          label="Distrito"
          placeholder="Selecciona el distrito"
          onFetch={
            Boolean(countryId)
              ? (params) =>
                  getDistrictsByCountry(countryId, {
                    ...params,
                    searchTerm: params.search,
                  })
              : undefined
          }
          objectValueKey="id"
          objectKeyLabel="name"
          disabled={!countryId}
          required
          queryKey={`districts-${countryId}`}
        />
        <RHFInput name="address.city" label="Ciudad" placeholder="Ciudad" />

        <RHFInput
          name="address.mainStreet"
          label="Calle principal"
          placeholder="Calle principal"
        />
        <RHFInput name="address.number" label="Número" placeholder="Número" />

        <RHFInput
          name="address.otherStreets"
          label="Otras calles"
          placeholder="Cruces o referencias"
        />
        <RHFInput
          name="address.zipcode"
          label="Código postal"
          placeholder="00000"
        />

        <RHFInput
          name="address.annotations"
          label="Anotaciones"
          placeholder="Notas adicionales"
        />

        <div className="col-span-1 md:col-span-2">
          <RHFCheckbox
            name="address.difficultAccessArea"
            label="Zona de difícil acceso"
          />
        </div>
      </div>
    </section>
  );
}
