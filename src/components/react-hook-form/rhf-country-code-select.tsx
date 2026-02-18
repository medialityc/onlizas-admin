import { cn } from "@/lib/utils";
import { getCountries } from "@/services/countries";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

type Country = {
  id: number | string;
  name: string;
  code: string;
  phoneNumberCode: number;
  region: string;
  active: boolean;
};

type Props = {
  name: string;
  variant?: "code" | "name"; // ← nueva prop para filtrar
  inputClassname?: string;
  fullwidth?: boolean;
  storeCode?: boolean; // ← nueva prop para almacenar código en lugar de ID
  disabled?: boolean;
  label?: string;
  required?: boolean;
  placeholder?: string;
};

export function RHFCountrySelect({
  name,
  variant = "code",
  inputClassname,
  fullwidth = false,
  storeCode = false,
  disabled = false,
  label,
  required,
  placeholder,
}: Props) {
  const { control, watch } = useFormContext();
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const selectedValue = watch(name);
  const selectedCountry = countries.find((country) =>
    storeCode
      ? country.code.toLowerCase() === String(selectedValue ?? "").toLowerCase()
      : String(country.id) === String(selectedValue ?? ""),
  );

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getCountries();
        const data = res.data;
        if (data) {
          setCountries(data);
        } else {
          throw new Error("No data received");
        }
      } catch (err: any) {
        console.error("Error fetching countries:", err);
        if (control && "setError" in control) {
          control.setError(name, {
            type: "manual",
            message: "Error al obtener países",
          });
        }
      }
    };
    fetchCountries();
  }, [control, name]);

  const filteredCountries =
    query === ""
      ? countries
      : countries.filter((country) => {
          if (variant === "code") {
            const cleanedQuery = query.replace(/[^0-9]/g, "");
            return country.phoneNumberCode.toString().includes(cleanedQuery);
          }
          // variant === "name"
          return country.name.toLowerCase().includes(query.toLowerCase());
        });

  const getFlag = (code: string) => (
    <Image
      src={`/assets/images/flags/${code.toUpperCase()}.svg`}
      alt={code}
      className="h-5 w-6 object-cover rounded-sm"
      height={20}
      width={30}
    />
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange } }) => (
        <div
          className={cn(
            "flex w-full flex-col gap-2",
            fullwidth ? "max-w-none" : "shrink-0 max-w-25",
          )}
        >
          {label && (
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </label>
          )}
          <Combobox
            value={selectedCountry ?? null}
            onChange={(val) =>
              onChange(storeCode ? (val?.code ?? "") : val?.id)
            }
            disabled={disabled}
          >
            <div className="w-full flex flex-col gap-1 relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-md bg-transparent text-left sm:text-sm">
                <ComboboxInput
                  className={cn(
                    "form-input pl-8 pr-8 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-[#0f172a] dark:text-gray-100 dark:placeholder:text-gray-400",
                    inputClassname,
                    disabled &&
                      "bg-gray-100 dark:bg-gray-700 cursor-not-allowed",
                  )}
                  displayValue={(country: Country) =>
                    country
                      ? variant === "code"
                        ? `(+${country.phoneNumberCode})`
                        : country.name
                      : ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    placeholder ?? (variant === "code" ? "286" : "Cuba")
                  }
                  disabled={disabled}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Combobox.Button className="inline-flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                    <ChevronUpDownIcon className="h-4 w-4" aria-hidden="true" />
                  </Combobox.Button>
                </div>
                {selectedCountry && (
                  <div className="absolute z-30 left-2 top-1/2 -translate-y-1/2">
                    {getFlag(selectedCountry.code)}
                  </div>
                )}
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <ComboboxOptions className="z-50 custom-scrollbar w-full absolute mt-10 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-600 dark:bg-[#0f172a]">
                  {filteredCountries.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      No encontrado
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <ComboboxOption
                        key={country.id}
                        className={({ selected }) =>
                          cn(
                            "flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 dark:text-gray-200",
                            selected &&
                              "bg-blue-50 font-semibold dark:bg-blue-700/60 dark:text-white",
                          )
                        }
                        value={country}
                      >
                        {({ selected }) => (
                          <span className="truncate flex items-center gap-2">
                            {getFlag(country.code)}
                            {variant === "code"
                              ? `(+${country.phoneNumberCode})`
                              : country.name}
                          </span>
                        )}
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </Transition>
            </div>
          </Combobox>
        </div>
      )}
    />
  );
}
