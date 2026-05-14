"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";

export default function HolderDetailsSection() {
  const [open, setOpen] = useState(false);
  const [isInternational, setIsInternational] = useState(false);
  const { watch, setValue } = useFormContext();

  const country = watch("country");

  useEffect(() => {
    if (country === "CO" && !isInternational) {
      setValue("swiftCode", null);
    }
  }, [country, isInternational, setValue]);

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#232830] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span>Datos adicionales del titular</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-white dark:bg-[#1a1c23]">
          <RHFInputWithLabel
            name="accountHolderName"
            label="Nombre del titular"
            placeholder="Ej: Juan Pérez"
            maxLength={100}
            autoComplete="off"
          />
          <RHFSelectWithLabel
            name="documentType"
            label="Tipo de documento"
            placeholder="Seleccionar..."
            variant="native"
            options={[
              { value: "NIT", label: "NIT" },
              { value: "CC", label: "CC" },
              { value: "CE", label: "CE" },
              { value: "Pasaporte", label: "Pasaporte" },
              { value: "Otro", label: "Otro" },
            ]}
            emptyOption="Seleccionar..."
          />
          <RHFInputWithLabel
            name="documentNumber"
            label="Número de documento"
            placeholder="Ej: 123456789"
            maxLength={50}
          />
          <RHFInputWithLabel
            name="city"
            label="Ciudad"
            placeholder="Ej: Bogotá"
            maxLength={60}
          />
          <RHFCountrySelect
            name="country"
            label="País"
            variant="name"
            storeCode={true}
            placeholder="Seleccionar país..."
          />
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternational}
              onChange={(e) => setIsInternational(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-[#1a1c23]"
            />
            <span>Transferencias internacionales</span>
          </label>
          {(country !== "CO" || isInternational) && (
            <RHFInputWithLabel
              name="swiftCode"
              label="Código SWIFT"
              placeholder="Ej: BACOCOBB"
              maxLength={11}
            />
          )}
        </div>
      )}
    </div>
  );
}
