import { cn } from "@/lib/utils";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  searchPlaceholder?: string;
  value: string;
  onSearch: (value: string) => void;
  className?: string;
};
const FilterSearch = ({
  searchPlaceholder,
  value,
  onSearch,
  className,
}: Props) => {
  return (
    <div className={cn("flex flex-row relative", className)}>
      <input
        type="text"
        className={"pl-8 form-input w-full min-w-[100px] md:min-w-[400px]"}
        placeholder={searchPlaceholder || "Buscar..."}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />

      <MagnifyingGlassIcon className="absolute top-1/2 left-2 w-4 h-4 -translate-y-1/2" />
    </div>
  );
};

export default FilterSearch;
