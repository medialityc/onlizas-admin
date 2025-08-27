"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/cards/card";
import Badge from "@/components/badge/badge";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { SupplierApprovalProcess } from "@/types/suppliers";

interface ApprovalProcessStatusProps {
  approvalProcess: SupplierApprovalProcess | null;
  isLoadingApproval: boolean;
  getStateColor: (state: string) => string;
  getStateIcon: (state: string) => JSX.Element;
}

export function ApprovalProcessStatus({
  approvalProcess,
  isLoadingApproval,
  getStateColor,
  getStateIcon,
}: ApprovalProcessStatusProps) {
  // Loading State
  if (isLoadingApproval) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">
            Estado del Proceso de Aprobación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="dark:text-white flex items-center space-x-2">
          {approvalProcess ? (
            getStateIcon(approvalProcess?.state)
          ) : (
            <ClockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          )}
          <span>Estado del Proceso de Aprobación</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Estado Actual:
            </span>
            <Badge variant={getStateColor(approvalProcess?.state || "")}>
              {approvalProcess?.state || "Sin estado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Aprobado:
            </span>
            <Badge variant={approvalProcess?.isApproved ? "success" : "danger"}>
              {approvalProcess
                ? approvalProcess.isApproved
                  ? "Sí"
                  : "No"
                : "Sin definir"}
            </Badge>
          </div>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Approved Categories */}
          <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              Categorías Aprobadas (
              {approvalProcess?.approvedCategories?.length || 0})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(approvalProcess?.approvedCategories?.length ?? 0 > 0) ? (
                approvalProcess?.approvedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800"
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tiene categorías aprobadas
                </p>
              )}
            </div>
          </div>

          {/* Pending Categories */}
          <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
              <ClockIcon className="h-4 w-4 text-yellow-500 mr-2" />
              Categorías Pendientes (
              {approvalProcess?.pendingCategories?.length || 0})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(approvalProcess?.pendingCategories?.length ?? 0 > 0) ? (
                approvalProcess?.pendingCategories.map((category) => (
                  <div
                    key={category.id}
                    className="text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-800"
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tiene categorías pendientes
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Approved Documents */}
          <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              Documentos Aprobados (
              {approvalProcess?.approvedDocuments?.length || 0})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(approvalProcess?.approvedDocuments?.length ?? 0 > 0) ? (
                approvalProcess?.approvedDocuments.map((document) => (
                  <a
                    href={document.content}
                    key={document.id}
                    target="_blank"
                    className="block w-full text-left text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors underline cursor-pointer"
                    rel="noopener noreferrer"
                  >
                    {document.fileName}
                  </a>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tiene documentos aprobados
                </p>
              )}
            </div>
          </div>

          {/* Pending Documents */}
          <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
              <ClockIcon className="h-4 w-4 text-yellow-500 mr-2" />
              Documentos Pendientes (
              {approvalProcess?.pendingDocuments?.length || 0})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(approvalProcess?.pendingDocuments?.length ?? 0) > 0 ? (
                approvalProcess?.pendingDocuments?.map((document) => (
                  <a
                    href={document.content}
                    key={document.id}
                    target="_blank"
                    className="block w-full text-left text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors underline cursor-pointer"
                    rel="noopener noreferrer"
                  >
                    {document.fileName}
                  </a>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tiene documentos pendientes
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
