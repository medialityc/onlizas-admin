import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import { Country } from "@/types/countries";
import { getCountries } from "@/services/countries";
import { ApiResponse } from "@/types/fetch/api";

interface UseCountryReturn {
  country: Country | null;
  loading: boolean;
  error: boolean;
  flag: JSX.Element | null;
}

export function useCountry(countryId?: string | number): UseCountryReturn {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setCountry(null);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    getCountries()
      .then((countries: ApiResponse<Country[]>) => {
        if (!countries.data) {
          throw new Error("No se pudieron obtener los países");
        }

        const found = countries.data.find(
          (c) => String(c.id) === String(countryId)
        );

        setCountry(found || null);
        if (!found) {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error obteniendo país:", err);
        setCountry(null);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [countryId]);

  const flag = country ? (
    <Image
      src={`/assets/images/flags/${country.code.toUpperCase()}.svg`}
      alt={country.code}
      className="h-5 w-6 object-cover rounded-sm"
      height={20}
      width={30}
    />
  ) : null;

  return {
    country,
    loading,
    error,
    flag,
  };
}
