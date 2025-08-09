import { SupplierDetails } from "@/types/suppliers";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import BackButton from "./back-button";
import {
  CheckCircleIcon as CheckCircleSolid,
  XCircleIcon as XCircleSolid,
} from "@heroicons/react/24/solid";

function EditHeader({ supplierDetails }: { supplierDetails: SupplierDetails }) {
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {supplierDetails.name}
            </h1>
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
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-105 ${
                supplierDetails.isActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200 dark:shadow-green-900/50"
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-200 dark:shadow-red-900/50"
              }`}
            >
              {supplierDetails.isActive ? (
                <CheckCircleSolid className="w-4 h-4 mr-2" />
              ) : (
                <XCircleSolid className="w-4 h-4 mr-2" />
              )}
              {supplierDetails.isActive ? "Activo" : "Inactivo"}
            </span>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-105 ${
                supplierDetails.isAproved
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200 dark:shadow-green-900/50"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200 dark:shadow-amber-900/50"
              }`}
            >
              {supplierDetails.isAproved ? (
                <CheckCircleIcon className="w-4 h-4 mr-2" />
              ) : (
                <ClockIcon className="w-4 h-4 mr-2" />
              )}
              {supplierDetails.isAproved ? "Aprobado" : "Pendiente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditHeader;
