import type { Warehouse } from "@/types/warehouses";
import {
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import BackButton from "./back-button";

function EditHeader ({ warehouse }: { warehouse: Warehouse }) {
  const getStatusInfo = () => {
    switch (warehouse.status) {
      case 'active':
        return {
          label: 'Activo',
          class: 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/50'
        };
      case 'maintenance':
        return {
          label: 'Mantenimiento',
          class: 'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/50'
        };
      case 'inactive':
        return {
          label: 'Inactivo',
          class: 'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-800/50'
        };
      default:
        return {
          label: 'Desconocido',
          class: 'bg-gray-100 text-gray-700 ring-gray-300 dark:bg-gray-800/50 dark:text-gray-200 dark:ring-gray-700/50'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = warehouse.type === 'physical' ? BuildingStorefrontIcon : BuildingOfficeIcon;
  const iconBgColor = warehouse.type === 'physical'
    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
    : 'bg-gradient-to-br from-blue-500 to-indigo-600';

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-slideUp">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 ${iconBgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {warehouse.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusInfo.class}`}
                aria-label={`Estado: ${statusInfo.label}`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {statusInfo.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-300 dark:bg-gray-800/50 dark:text-gray-200 dark:ring-gray-700/50">
                {warehouse.type === 'physical' ? 'Físico' : 'Virtual'}
              </span>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {warehouse.managerEmail && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{warehouse.managerEmail}</span>
                </div>
              )}
              {warehouse.managerPhone && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{warehouse.managerPhone}</span>
                </div>
              )}
              {warehouse.location?.address && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{warehouse.location.address}</span>
                </div>
              )}
              {warehouse.managerName && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">Gestor: {warehouse.managerName}</span>
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
