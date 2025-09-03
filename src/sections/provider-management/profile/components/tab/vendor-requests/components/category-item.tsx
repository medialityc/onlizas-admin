"use client";

import { Info } from "lucide-react";

interface CategoryFeature {
  id?: number | string;
  name?: string;
  [key: string]: any;
}

interface Category {
  id: number | string;
  name: string;
  isActive?: boolean;
  departmentId?: number;
  departmentName?: string;
  description?: string;
  image?: string;
  features?: string[] | CategoryFeature[];
}

interface CategoryItemProps {
  category: Category;
  onClick: (category: Category) => void;
  status: "approved" | "pending";
}

export function CategoryItem({ category, onClick, status }: CategoryItemProps) {
  const colorClasses = {
    approved: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      hover: "hover:bg-green-100 dark:hover:bg-green-900/40",
      text: "text-green-600 dark:text-green-400"
    },
    pending: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
      text: "text-yellow-600 dark:text-yellow-400"
    }
  };
  
  const colors = colorClasses[status];
  
  return (
    <button
      onClick={() => onClick(category)}
      className={`w-full text-left text-sm text-gray-600 dark:text-gray-300 ${colors.bg} px-2 py-1.5 rounded-md border ${colors.border} ${colors.hover} transition-colors flex items-center justify-between group`}
    >
      <span className="truncate">{category.name}</span>
      <span className={`${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
        <Info className="h-4 w-4" />
      </span>
    </button>
  );
}
