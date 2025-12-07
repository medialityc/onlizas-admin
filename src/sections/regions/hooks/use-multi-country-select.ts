import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getCountries } from "@/services/countries";
import { Country } from "@/types/countries";
import { ApiResponse } from "@/types/fetch/api";

export interface UseMultiCountrySelectOptions {
  initialCountryIds?: string[];
}

export interface UseMultiCountrySelectReturn {
  countries: Country[];
  selectedCountries: Country[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredCountries: Country[];
  toggleCountry: (countryId: string) => void;
  removeCountry: (countryId: string) => void;
  selectedCountryIds: string[];
  setSelectedCountryIds: (ids: string[]) => void;
}

export function useMultiCountrySelect({
  initialCountryIds = [],
}: UseMultiCountrySelectOptions = {}): UseMultiCountrySelectReturn {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize selectedCountryIds with initialCountryIds
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>(() => {
    return initialCountryIds || [];
  });
  
  // Track the previous initialCountryIds to detect changes
  const prevInitialCountryIds = useRef<string[]>([]);

  // Fetch countries only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCountries();
        
        if (!isMounted) return;
        
        if (response.error) {
          setError(response.message || "Error al cargar países");
          return;
        }

        if (response.data?.data) {
          setCountries(response.data.data);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching countries:", err);
        setError("Error al cargar países");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCountries();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Update selectedCountryIds only when initialCountryIds actually changes
  useEffect(() => {
    const newIds = initialCountryIds || [];
    
    // Only update if the initialCountryIds actually changed (not just re-rendered)
    if (!arraysEqual(prevInitialCountryIds.current, newIds)) {
      setSelectedCountryIds(newIds);
      prevInitialCountryIds.current = [...newIds];
    }
  }, [initialCountryIds]);

  // Helper function to compare arrays
  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x.localeCompare(y));
    const sortedB = [...b].sort((x, y) => x.localeCompare(y));
    return sortedA.every((val, index) => val === sortedB[index]);
  }

  // Get selected countries objects (memoized to avoid recalculation)
  const selectedCountries = useMemo(() => 
    countries.filter(country => selectedCountryIds.includes(country.id)), 
    [countries, selectedCountryIds]
  );

  // Filter countries based on search term (memoized to avoid recalculation)
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return countries;
    const search = searchTerm.toLowerCase();
    return countries.filter(country => 
      country.name.toLowerCase().includes(search) ||
      country.code.toLowerCase().includes(search)
    );
  }, [countries, searchTerm]);

  // Toggle country selection
  const toggleCountry = useCallback((countryId: string) => {
    setSelectedCountryIds(prev => {
      if (prev.includes(countryId)) {
        return prev.filter(id => id !== countryId);
      } else {
        return [...prev, countryId];
      }
    });
  }, []);

  // Remove country from selection
  const removeCountry = useCallback((countryId: string) => {
    setSelectedCountryIds(prev => prev.filter(id => id !== countryId));
  }, []);

  // Stable wrapper for setSelectedCountryIds
  const setSelectedCountryIdsWrapper = useCallback((ids: string[]) => {
    setSelectedCountryIds(ids);
  }, []);

  return {
    countries,
    selectedCountries,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredCountries,
    toggleCountry,
    removeCountry,
    selectedCountryIds,
    setSelectedCountryIds: setSelectedCountryIdsWrapper,
  };
}
