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

type Country = {
  id: number|string;
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
};

export function RHFCountrySelect({
  name,
  variant = "code",
  inputClassname,
  fullwidth = false,
  storeCode = false,
}: Props) {
  const { control, watch } = useFormContext();
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const selectedValue = watch(name);
  const selectedCountry = countries.find(
    (country) => storeCode 
      ? country.code === selectedValue 
      : country.id === Number(selectedValue)
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
            "w-full",
            fullwidth ? "max-w-none" : "flex-shrink-0 max-w-[100px]"
          )}
        >
          <Combobox
            value={selectedCountry ?? null}
            onChange={(val) => onChange(storeCode ? val?.code ?? "" : Number(val?.id) ?? -1)}
          >
            <div className="w-full flex flex-col gap-1 relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left sm:text-sm">
                <ComboboxInput
                  className={cn("form-input pl-8", inputClassname)}
                  displayValue={(country: Country) =>
                    country
                      ? variant === "code"
                        ? `(+${country.phoneNumberCode})`
                        : country.name
                      : ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={variant === "code" ? "286" : "Cuba"}
                />
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
                <ComboboxOptions className="z-50 custom-scrollbar w-full absolute mt-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filteredCountries.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      No encontrado
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <ComboboxOption
                        key={country.id}
                        className={({ selected }) =>
                          `relative hover:bg-secondary hover:text-white cursor-pointer transition-colors duration-300 p-2 ${
                            selected ? "bg-primary text-white" : "text-gray-900"
                          }`
                        }
                        value={country}
                      >
                        {({ selected }) => (
                          <span
                            className={`truncate flex items-center gap-2 ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
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
