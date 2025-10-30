"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export default function BackButton({
  fallbackUrl = "/dashboard/warehouses",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(fallbackUrl);
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      <ArrowLeftIcon className="mr-2 h-4 w-4" />
      Regresar
    </button>
  );
}
