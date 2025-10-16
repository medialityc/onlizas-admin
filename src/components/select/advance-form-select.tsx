import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

export interface SearchSelectProps<T = any> {
  name: string;
  label?: string;
  placeholder?: string;
  options: T[];
  objectValueKey: keyof T;
  objectKeyLabel?: keyof T;
  exclude?: string[];
  loading?: boolean;
  required?: boolean;
  multiple?: boolean;
  onChangeOptional?: () => void;
  onOptionSelected?: (option: T) => void;
  onScrollEnd?: () => void;
  renderOption?: (option: T) => React.ReactNode;
  dataTest?: string;
  containerClassname?: string;
  pillsClassname?: string;
  renderMultiplesValues?: (
    options: T[],
    removeSelected: (option: T) => void
  ) => React.ReactNode;
  query?: string;
  setQuery?: (q: string) => void;
  inputClassName?: string;
  disabled?: boolean;
}

export function AdvancedSearchSelect<T>({
  name,
  label,
  placeholder,
  options,
  objectValueKey,
  objectKeyLabel,
  loading,
  required,
  multiple = false,
  onChangeOptional,
  onScrollEnd,
  renderOption,
  dataTest,
  containerClassname,
  pillsClassname,
  inputClassName,
  onOptionSelected,
  renderMultiplesValues,
  query = "",
  disabled,
  setQuery,
}: SearchSelectProps<T>) {
  const { control } = useFormContext();
  const scrollRef = useRef<HTMLUListElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isClickingOption, setIsClickingOption] = useState(false);

  // Dedupe options by objectValueKey (evita triples cuando llegan duplicados por paginación acumulada)
  const uniqueOptions = useMemo(() => {
    const seen = new Set<any>();
    const list: T[] = [];
    for (const opt of options) {
      const val: any = (opt as any)[objectValueKey];
      if (seen.has(val)) continue;
      seen.add(val);
      list.push(opt);
    }
    return list;
  }, [options, objectValueKey]);

  // Get display value for an option
  const getDisplayValue = useCallback(
    (option: T): string => {
      if (renderOption) {
        const rendered = renderOption(option);
        if (typeof rendered === "string") {
          return rendered;
        }
      }
      return String(
        objectKeyLabel ? option[objectKeyLabel] : option[objectValueKey]
      );
    },
    [objectKeyLabel, objectValueKey, renderOption]
  );

  // Filter options based on exclude and query (si en el futuro se usa query local)
  const filteredOptions = uniqueOptions;

  const handleScroll = () => {
    if (!scrollRef.current || !onScrollEnd) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      onScrollEnd();
    }
  };

  const handleSelect = (
    option: T,
    currentValue: any,
    onChange: (value: any) => void
  ) => {
    setIsClickingOption(true);
    const value = option[objectValueKey];

    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      const newValue = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
      onChange(newValue);
      if (setQuery) setQuery("");
    } else {
      onChange(value);
      if (setQuery) setQuery(getDisplayValue(option));
      setIsOpen(false);
    }
    setIsTyping(false);
    onChangeOptional?.();
    onOptionSelected?.(option);
    setTimeout(() => setIsClickingOption(false), 100);
  };

  const removeSelected = (
    valueToRemove: any,
    currentValue: any,
    onChange: (value: any) => void
  ) => {
    if (!multiple) return;
    const newValue = Array.isArray(currentValue)
      ? currentValue.filter((v) => v !== valueToRemove)
      : [];
    onChange(newValue);
    onChangeOptional?.();
  };

  const scrollPills = (direction: "left" | "right") => {
    if (!pillsRef.current) return;

    const scrollAmount = 200;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    pillsRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  const getSelectedOptions = (currentValue: any) => {
    if (!multiple || !currentValue) return [];

    const selectedValues = Array.isArray(currentValue)
      ? currentValue
      : [currentValue];
    return uniqueOptions.filter((opt) =>
      selectedValues.includes(opt[objectValueKey])
    );
  };

  // Sync query with form value for single select SOLO si no está escribiendo
  const syncQueryWithValue = useCallback(
    (value: any) => {
      if (isTyping) return; // <--- prevención!
      if (!multiple && value) {
        const selectedOption = uniqueOptions.find(
          (opt) => opt[objectValueKey] === value
        );
        if (selectedOption) {
          const display = getDisplayValue(selectedOption);
          if (setQuery && display !== query) setQuery(display); // evita re-sincronizar idéntico
        }
      } else if (!multiple && !value) {
        if (setQuery) setQuery("");
      }
    },
    [
      multiple,
      uniqueOptions,
      objectValueKey,
      getDisplayValue,
      setQuery,
      isTyping,
      query,
    ]
  );

  // Watch for form value changes to sync with query SOLO si no está escribiendo
  const { watch } = useFormContext();
  const watchedValue = watch(name);

  useEffect(() => {
    syncQueryWithValue(watchedValue);
  }, [watchedValue, syncQueryWithValue]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      disabled={disabled}
      render={({ field, fieldState: { error } }) => {
        const selectedOptions = getSelectedOptions(field.value);

        return (
          <div
            className={cn("w-full ", containerClassname)}
            data-test={dataTest}
          >
            {label && (
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-[13px]">
                {label}
                {required && <span className="text-red-500"> *</span>}
              </label>
            )}

            <div className="relative">
              <input
                disabled={disabled}
                type="text"
                value={query}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (setQuery) setQuery(newValue);
                  setIsOpen(true);
                  setIsTyping(true); // <---- ahora está escribiendo!
                  onChangeOptional?.();
                }}
                onFocus={() => {
                  setIsOpen(true);
                  setIsTyping(true);
                }}
                onBlur={() => {
                  // Don't close if clicking on an option
                  if (!isClickingOption) {
                    setTimeout(() => setIsOpen(false), 200);
                  }
                  setIsTyping(false);
                }}
                placeholder={placeholder}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={cn(
                  "form-input w-full",
                  error &&
                    "ring-1 ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500",
                  inputClassName
                )}
              />

              {loading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
              {/* Selected pills */}

              {isOpen && (
                <ul
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="absolute z-50 mt-1 w-full bg-white dark:bg-[#121c2c] border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const isSelected = multiple
                        ? Array.isArray(field.value) &&
                          field.value.includes(option[objectValueKey])
                        : field.value === option[objectValueKey];

                      return (
                        <li
                          key={String(option[objectValueKey])}
                          className={`cursor-pointer  px-4 py-2 ${isSelected ? "bg-blue-100 dark:bg-blue-600 dark:text-white" : "hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white form-input"}`}
                          onClick={() =>
                            handleSelect(option, field.value, field.onChange)
                          }
                        >
                          {renderOption
                            ? renderOption(option)
                            : getDisplayValue(option)}
                          {isSelected && <span className="float-right">✓</span>}
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                      No hay opciones
                    </li>
                  )}
                </ul>
              )}
            </div>
            {multiple && selectedOptions.length > 0 && (
              <div className="relative mt-2">
                {renderMultiplesValues ? (
                  renderMultiplesValues(selectedOptions, (option: T) => {
                    removeSelected(
                      option[objectValueKey],
                      field.value,
                      field.onChange
                    );
                  })
                ) : (
                  <div className="flex items-center">
                    {scrollPosition > 0 && (
                      <button
                        type="button"
                        onClick={() => scrollPills("left")}
                        className="p-1 mr-1 text-gray-600 hover:text-gray-900"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                    )}

                    <div
                      ref={pillsRef}
                      className="flex-1 flex space-x-2 overflow-x-hidden scrollbar-hide"
                    >
                      {selectedOptions.map((option) => (
                        <div
                          key={String(option[objectValueKey])}
                          className={cn(
                            "flex-shrink-0 flex items-center bg-primary text-white rounded-full px-3 py-1 text-sm",
                            pillsClassname
                          )}
                        >
                          <span className="truncate max-w-xs">
                            {getDisplayValue(option)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelected(
                                option[objectValueKey],
                                field.value,
                                field.onChange
                              );
                            }}
                            className="ml-2 p-0.5 rounded-full hover:bg-primary-dark"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {pillsRef.current &&
                      scrollPosition <
                        pillsRef.current.scrollWidth -
                          pillsRef.current.clientWidth && (
                        <button
                          type="button"
                          onClick={() => scrollPills("right")}
                          className="p-1 ml-1 text-gray-600 hover:text-gray-900"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      )}
                  </div>
                )}
              </div>
            )}
            {error && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
