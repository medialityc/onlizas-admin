import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorIndicatorProps {
  errorCount: number;
  onShow: () => void;
  isVisible: boolean;
}

export default function ErrorIndicator({ 
  errorCount, 
  onShow, 
  isVisible 
}: ErrorIndicatorProps) {
  if (!isVisible || errorCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onShow}
        className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2 animate-pulse"
      >
        <ExclamationTriangleIcon className="h-5 w-5" />
        <span className="text-sm font-medium">
          {errorCount} error{errorCount !== 1 ? 'es' : ''}
        </span>
      </button>
    </div>
  );
}
