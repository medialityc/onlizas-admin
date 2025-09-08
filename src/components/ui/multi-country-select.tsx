import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMultiCountrySelect } from "@/sections/regions/hooks/use-multi-country-select";


interface CountryFlagProps {
  code: string;
  className?: string;
  height?: number;
  width?: number;
}

function CountryFlag({ code, className, height = 20, width = 30 }: CountryFlagProps) {
  const [src, setSrc] = useState(`/assets/images/flags/${String(code || "").toUpperCase()}.svg`);
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={String(code)}
      onError={() => {
        if (src !== "/assets/images/flags/EN.svg") {
          setSrc("/assets/images/flags/EN.svg");
        }
      }}
      className={className}
      height={height}
      width={width}
    />
  );
}

interface MultiCountrySelectProps {
  selectedCountryIds: number[];
  onSelectionChange: (countryIds: number[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function MultiCountrySelect({
  selectedCountryIds,
  onSelectionChange,
  placeholder = "Selecciona países",
  label,
  required = false,
  disabled = false,
  error,
}: MultiCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    selectedCountries,
    loading,
    error: hookError,
    searchTerm,
    setSearchTerm,
    filteredCountries,
    toggleCountry,
    removeCountry,
    selectedCountryIds: hookSelectedIds,
  } = useMultiCountrySelect({
    initialCountryIds: selectedCountryIds,
  });

  // Notify parent when selection changes in the hook
  const prevHookSelectedIds = useRef<number[]>([]);
  useEffect(() => {
    // Only notify if the hook's selection actually changed
    if (!arraysEqual(hookSelectedIds, prevHookSelectedIds.current)) {
      onSelectionChange(hookSelectedIds);
      prevHookSelectedIds.current = [...hookSelectedIds];
    }
  }, [hookSelectedIds, onSelectionChange]);

  // Helper function to compare arrays
  function arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);
    return sortedA.every((val, index) => val === sortedB[index]);
  }

  const displayError = error || hookError;

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleCountrySelect = useCallback((countryId: number) => {
    toggleCountry(countryId);
  }, [toggleCountry]);

  const handleRemoveCountry = useCallback((countryId: number) => {
    removeCountry(countryId);
  }, [removeCountry]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`form-input w-full min-h-[42px] cursor-pointer ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${displayError ? "border-red-500 ring-red-500" : ""}`}
          onClick={handleToggleDropdown}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {selectedCountries.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedCountries.map((country) => (
                    <div
                      key={country.id}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <CountryFlag
                        code={country.code}
                        className="h-3 w-4 object-cover rounded-sm"
                        height={12}
                        width={16}
                      />
                      <span>{country.name}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCountry(country.id);
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <span className="mt-2 block">Cargando países...</span>
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No se encontraron países
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = hookSelectedIds.includes(country.id);
                  return (
                    <div
                      key={country.id}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isSelected ? "bg-blue-50 dark:bg-blue-900" : ""
                      }`}
                      onClick={() => handleCountrySelect(country.id)}
                    >
                      <CountryFlag
                        code={country.code}
                        className="h-5 w-6 object-cover rounded-sm"
                        height={20}
                        width={30}
                      />
                      <span className="flex-1">{country.name}</span>
                      {isSelected && (
                        <span className="text-blue-600 font-medium">✓</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}
