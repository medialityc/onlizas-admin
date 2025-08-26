"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/cards/card";
import { Label } from "@/components/label/label";
import { Input } from "@mantine/core";
import { IUser, UserResponseMe } from "@/types/users";
import {
  CalendarIcon,
  UserIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FolderIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useSupplierApprovalProcess } from "@/sections/provider-management/profile/hooks/use-supplier-approval-process";
import { extendApprovalProcess } from "@/services/approval-processes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Badge from "@/components/badge/badge";
import CategoryRequestModal from "../modal/category-request-modal";
import ExpirationExtensionModal from "../modal/expiration-extension-modal";
import showToast from "@/config/toast/toastConfig";

interface VendorRequestsTabProps {
  user: UserResponseMe | null;
}

export default function VendorRequestsTab({ user }: VendorRequestsTabProps) {
  // Cast the attributes to the specific provider attributes type

  const { data: approvalProcess, isLoading: isLoadingApproval } =
    useSupplierApprovalProcess();

  const queryClient = useQueryClient();

  // Verificar si hay proceso de aprobación disponible
  const hasApprovalProcess = useMemo(
    () => !!approvalProcess?.approvalProcessId,
    [approvalProcess]
  );
  const isRequestsDisabled = useMemo(
    () => !hasApprovalProcess,
    [hasApprovalProcess]
  );

  // Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [expirationModalOpen, setExpirationModalOpen] = useState(false);
  const existingIds = [
    ...(approvalProcess?.approvedCategories ?? []).map((c: { id: number }) =>
      String(c.id)
    ),
    ...(approvalProcess?.pendingCategories ?? []).map((c: { id: number }) =>
      String(c.id)
    ),
  ];

  // Mutation for extending approval process
  const extendApprovalMutation = useMutation({
    mutationFn: (data: any) => {
      console.log(user);

      const formData = new FormData();
      formData.append(
        "approvalProcessId",
        user?.approvalProcessId?.toString() || "0"
      );
      if (data.extendCategories) {
        data.categoryIds?.forEach((id: any) =>
          formData.append("categoryIds", id.toString())
        );
        formData.append("extendCategories", "true");
      }

      if (data.extendExpiration) {
        // Append the new expiration date
        formData.append(
          "newExpirationDate",
          data.newExpirationDate.toISOString()
        );
        formData.append("extendExpiration", "true");
      }

      // Append document names
      if (data.documentNames?.length ?? 0 > 0) {
        data.documentNames?.forEach((name: string) =>
          formData.append("documentNames", name)
        );
        // Append file contents
        data.contents?.forEach((content: any) => {
          if (content instanceof File) {
            formData.append("contents", content);
          } else {
            formData.append(
              "contents",
              new Blob([content], { type: "text/plain" })
            );
          }
        });
      }

      // Append comments
      if (data.comments) {
        formData.append("comments", data.comments);
      }

      console.log(formData);

      // Use the approval process ID from the current data, or default to 0 if not available
      return extendApprovalProcess(user?.id || 0, formData);
    },
    onSuccess: () => {
      showToast("Solicitud enviada exitosamente", "success");
      queryClient.invalidateQueries({
        queryKey: ["supplier-approval-process"],
      });
      setCategoryModalOpen(false);
      setExpirationModalOpen(false);
    },
    onError: (error: any) => {
      showToast(error.message || "Error al enviar la solicitud", "error");
    },
  });

  const handleCategoryRequest = (data: any) => {
    const categoryIds = data.categoryIds.map((id: string) => parseInt(id));
    extendApprovalMutation.mutate({
      approvalProcessId: approvalProcess?.approvalProcessId || 0,
      extendCategories: true,
      categoryIds,
      documentNames: data.documentNames,
      contents: data.contents,
      comments: data.comments,
    });
  };

  const handleExpirationExtension = (data: any) => {
    extendApprovalMutation.mutate({
      approvalProcessId: approvalProcess?.approvalProcessId || 0,
      extendExpiration: true,
      newExpirationDate: data.newExpirationDate,
      documentNames: data.documentNames,
      contents: data.contents,
      comments: data.comments,
    });
  };

  const getStateColor = (state: string) => {
    console.log("Getting state color for:", state);
    switch (state?.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "info";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state?.toLowerCase()) {
      case "approved":
        return (
          <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
        );
      case "pending":
        return (
          <ClockIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
        );
      case "rejected":
        return (
          <XCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
        );
      default:
        return (
          <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoadingApproval ? (
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
      ) : (
        <>
          {/* Approval Process Status - Always rendered */}
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
                  <Badge
                    variant={approvalProcess?.isApproved ? "success" : "danger"}
                  >
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
                        <div
                          key={document.id}
                          className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800"
                        >
                          {document.fileName}
                        </div>
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
                        <div
                          key={document.id}
                          className="text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-800"
                        >
                          {document.fileName}
                        </div>
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
        </>
      )}

      {/* User Attributes Section */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="dark:text-white flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span>Información del Vendedor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <CalendarIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Fecha de Expiración
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {approvalProcess?.expirationDate || "No especificada"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <UserIcon className="h-6 w-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Tipo de Vendedor
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {approvalProcess?.sellerType || "No especificado"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <GlobeAltIcon className="h-6 w-6 text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Alcance de Mercado
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {approvalProcess?.nacionality || "No especificado"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <DocumentTextIcon className="h-6 w-6 text-orange-500 dark:text-orange-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Código MINCEX
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {approvalProcess?.mincexCode || "No especificado"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <MapPinIcon className="h-6 w-6 text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  País
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {approvalProcess?.countryName || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Request Form */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="dark:text-white flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <span>Solicitudes de Aprobación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              📝 Puede solicitar autorización para nuevas categorías o extender
              la fecha de expiración de su autorización actual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Solicitar Categorías */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-3 mb-4">
                <FolderIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Solicitar Categorías
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Pida autorización para vender en nuevas categorías
                  </p>
                </div>
              </div>
              {/* {
                 isRequestsDisabled &&   <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    ⚠️ Debe tener un proceso de aprobación activo para solicitar
                    categorías
                  </p>
                </div>
              } */}
              <Button
                onClick={() => setCategoryModalOpen(true)}
                /*                 disabled={isRequestsDisabled}
                 */ className={`w-full py-2 px-4 rounded-lg font-medium shadow-none border-none transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  /* isRequestsDisabled
                    ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                    : */ "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Solicitar Categorías</span>
              </Button>
            </div>

            {/* Extender Fecha */}
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center space-x-3 mb-4">
                <CalendarIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Extender Fecha
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Solicite una extensión de la fecha de expiración
                  </p>
                </div>
              </div>
              {/* {
                 isRequestsDisabled &&   <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    ⚠️ Debe tener un proceso de aprobación activo para extender
                    la fecha
                  </p>
                </div>
              } */}
              <Button
                onClick={() => setExpirationModalOpen(true)}
                /*                 disabled={isRequestsDisabled}
                 */ className={`w-full py-2 px-4 rounded-lg shadow-none border-none font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  /*  isRequestsDisabled
                    ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                    : */ "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Extender Fecha</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <CategoryRequestModal
        isOpen={categoryModalOpen}
        existingIds={existingIds}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCategoryRequest}
        loading={extendApprovalMutation.isPending}
      />

      <ExpirationExtensionModal
        isOpen={expirationModalOpen}
        onClose={() => setExpirationModalOpen(false)}
        onSubmit={handleExpirationExtension}
        loading={extendApprovalMutation.isPending}
        currentExpirationDate={user?.supplierInfo.expirationDate || undefined}
      />
    </div>
  );
}
