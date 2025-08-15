'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput ({ value, onChange, placeholder = "Buscar", className }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        type="text"
        className="form-input w-auto min-w-[100px] md:min-w-[300px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}
