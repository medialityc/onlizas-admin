import type { SupplierDetails } from "@/types/suppliers";
import { processesState } from "@/types/suppliers";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import BackButton from "./back-button";

function EditHeader({ supplierDetails }: { supplierDetails: SupplierDetails }) {
  const statusInfo = processesState.find(
    (p) => p.value === supplierDetails.state
  );
  const statusLabel = statusInfo?.name ?? supplierDetails.state;
  const statusClass =
    {
      WaitingExtension:
        "bg-purple-100 text-purple-800 ring-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:ring-purple-800/50",
      Pending:
        "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/50",
      WaitingLogin:
        "bg-blue-100 text-blue-800 ring-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800/50",
      Approved:
        "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/50",
      Rejected:
        "bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-800/50",
    }[supplierDetails.state] ||
    "bg-gray-100 text-gray-700 ring-gray-300 dark:bg-gray-800/50 dark:text-gray-200 dark:ring-gray-700/50";
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-slideUp">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BuildingOfficeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {supplierDetails.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusClass}`}
                aria-label={`Estado: ${statusLabel}`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {statusLabel}
              </span>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                <span className="text-sm">{supplierDetails.email}</span>
              </div>
              {supplierDetails.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{supplierDetails.phone}</span>
                </div>
              )}
              {supplierDetails.address && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{supplierDetails.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <BackButton />
        </div>
      </div>
    </div>
  );
}

export default EditHeader;
