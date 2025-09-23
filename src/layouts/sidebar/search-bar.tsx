"use client";
import { Search, X } from "lucide-react";
import { useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="px-4 pb-3 border-b border-gray-100 dark:border-gray-800">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary" />
        <input
          type="text"
          // Using form styles consistent with tailwind setup
          className="w-full rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 pl-9 pr-8 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
          placeholder="Buscar..."
          value={value}
          onChange={handleChange}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
