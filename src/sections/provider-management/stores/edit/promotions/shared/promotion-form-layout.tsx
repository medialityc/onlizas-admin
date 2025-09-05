import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PromotionFormLayoutProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
}

/**
 * Layout base para formularios de promociones
 * Proporciona header, navegación y estructura común
 */
export default function PromotionFormLayout({ 
  title, 
  subtitle, 
  onBack, 
  children 
}: PromotionFormLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Volver"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
