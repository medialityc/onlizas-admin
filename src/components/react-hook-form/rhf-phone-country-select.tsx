import { cn } from "@/lib/utils";
import { Country } from "@/types/countries";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import CountriesCombobox from "../phone-input/country-phone-input/country-combobox";
import PhoneNumberInput from "../phone-input/country-phone-input/phone-number-input";
import useCountries from "../phone-input/use-countries";
import { useMyIp } from "../phone-input/use-myip";

type Props = {
  phoneFieldName: string;
  countryFieldName: string;
  countryValueKey?: keyof Country;
};

export function RHFPhoneCountrySelect({
  phoneFieldName,
  countryFieldName,
  countryValueKey = "code",
}: Props) {
  const { formState, watch, setValue } = useFormContext();
  const { errors, touchedFields, dirtyFields, isSubmitted } = formState;

  const { countries, isLoading } = useCountries();
  const myIPData = useMyIp();
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const currentPhoneNumberCode = watch(countryFieldName);

  // # INITIALIZE CURRENT COUNTRY
  useEffect(() => {
    if (countries.length === 0) return;

    if (currentPhoneNumberCode && currentCountry == null) {
      const country = countries?.find((c) => {
        const key: keyof Country = countryValueKey ?? "code";
        return c[key] === currentPhoneNumberCode;
      });
      if (country) {
        setCurrentCountry(country);
        return;
      }
    } else if (currentCountry == null && myIPData?.data) {
      const { region, calling_code, ip, country, country_code } = myIPData.data;
      const countryByIp: Country = {
        name: country,
        code: country_code,
        id: ip,
        active: true,
        phoneNumberCode: Number(calling_code),
        region: region,
      };
      setCurrentCountry(countryByIp);
      setValue(countryFieldName, countryByIp[countryValueKey]);
    }
  }, [
    countries,
    countryFieldName,
    countryValueKey,
    currentCountry,
    currentPhoneNumberCode,
    myIPData.data,
    setValue,
  ]);

  const handleChangeCountry = (country: Country) => {
    setCurrentCountry(country);
    setValue(countryFieldName, country[countryValueKey]);
  };

  const rawPhoneValue = watch(phoneFieldName);
  const currentPhoneNumberValue: string =
    typeof rawPhoneValue === "string" ? rawPhoneValue : "";
  const handleNumberChange = (val: string) =>
    setValue(phoneFieldName, val, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

  const phoneError = errors?.[phoneFieldName] as any;
  const errorMessage: string | undefined = phoneError?.message;
  const phoneTouched =
    !!(touchedFields as any)[phoneFieldName] ||
    !!(dirtyFields as any)[phoneFieldName];
  const countryTouched =
    !!(touchedFields as any)[countryFieldName] ||
    !!(dirtyFields as any)[countryFieldName];
  const showError =
    (phoneTouched || countryTouched || isSubmitted) && !!errorMessage;

  return (
    <div className={cn("flex w-full flex-col gap-1")}>
      {countries.length === 0 ? (
        <div className="flex w-full items-center justify-center min-h-[40px]">
          <span className="text-xs text-gray-700 dark:text-gray-200">
            No hay países disponibles
          </span>
        </div>
      ) : (
        <>
          <div className="flex w-full items-center">
            {/* Combobox (country code selector) */}
            <div className={cn("shrink-0")}>
              <CountriesCombobox
                countries={countries}
                selectedCountry={currentCountry}
                onSelect={handleChangeCountry}
                disabled={isLoading}
              />
            </div>

            {/* Phone number input */}
            <div className="flex-1">
              <PhoneNumberInput
                value={currentPhoneNumberValue}
                onChange={handleNumberChange}
                maxLength={15}
              />
            </div>
          </div>
          {/* Helper preview */}
          <div className="text-xs text-gray-500">
            {currentCountry && currentPhoneNumberValue
              ? `+${currentCountry.phoneNumberCode} ${currentPhoneNumberValue}`
              : ""}
          </div>
          {showError && (
            <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
}
