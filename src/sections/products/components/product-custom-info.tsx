"use client";

import { RHFCheckbox, RHFInputWithLabel } from "@/components/react-hook-form";
import IconBox from "@/components/icon/icon-box";
import { usePathname } from "next/navigation";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAduanaCategories } from "@/services/categories";
import { getAllBrands } from "@/services/brands";

export const ProductCustomsInfoSection = () => {
  const pathname = usePathname();
  return (
    <div className="bg-blur-card p-4 rounded-md flex flex-col w-full gap-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <IconBox className="mr-2 w-5 h-5" /> Información Aduanera
      </h3>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInputWithLabel
          name="customsValueAduanaUsd"
          label="Valor Aduanero"
          placeholder="0.00"
          type="number"
          step={0.01}
          min={0}
          prefix="$"
        />
        <RHFInputWithLabel
          name="valuePerUnit"
          label="Valor por Cantidad"
          placeholder="0.00"
          type="number"
          step={0.01}
          min={0}
          prefix="$"
        />
      </div> */}

      {/* Producto Duradero */}

      {!pathname.endsWith("edit") && (
        <RHFCheckbox name="active" label="Producto activo" />
      )}

      {/* Categoría Aduanal */}
      <RHFAutocompleteFetcherInfinity
        name="aduanaCategoryGuid"
        onFetch={getAduanaCategories}
        label="Categoría Aduanal"
        objectKeyLabel="name"
        objectValueKey="guid"
        placeholder="Seleccione una categoría aduanal"
        required
      />
      {/* Marca */}
      <RHFAutocompleteFetcherInfinity
        name="brandId"
        onFetch={getAllBrands}
        label="Marca"
        objectKeyLabel="name"
        objectValueKey="id"
        placeholder="Seleccione una marca"
        required
      />
      {/* GTIN */}
      <RHFInputWithLabel
        name="gtin"
        label="GTIN"
        placeholder="Ej: 1234567890123"
        required
      />
      {/* <RHFAutocompleteFetcherInfinity
        name="unitGuid"
        onFetch={getAllUnits}
        label="Unidad"
        objectKeyLabel="guid"
        placeholder="Seleccione una unidad"
      /> */}
    </div>
  );
};
