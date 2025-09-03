"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/cards/card";
import Badge, { Variant } from "@/components/badge/badge";
import { SupplierApprovalProcess } from "@/types/suppliers";
import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";

import { CategoryItem } from "./category-item";
import { DocumentItem } from "./document-item";
import { CategoryDetailsModal, type CategoryDetails } from "./category-details-modal";

interface ApprovalProcessStatusProps {
  approvalProcess: SupplierApprovalProcess | null;
  isLoadingApproval: boolean;
  getStateColor: (state: string) => Variant;
  getStateIcon: (state: string) => JSX.Element;
  getStateName: (state: string) => string;
}

export function ApprovalProcessStatus({
  approvalProcess,
  isLoadingApproval,
  getStateColor,
  getStateIcon,
  getStateName,
}: ApprovalProcessStatusProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCategoryModal = (category: any) => {
    // Convertir la categoría recibida a CategoryDetails
    const categoryDetails: CategoryDetails = {
      id: category.id,
      name: category.name,
      isActive: category.isActive || false,
      departmentId: category.departmentId || 0,
      departmentName: category.departmentName || "",
      description: category.description || "",
      image: category.image || "",
      features: category.features || [],
    };

    setSelectedCategory(categoryDetails);
    setIsModalOpen(true);
  };

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
    <>
      <CategoryDetailsModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="dark:text-white flex items-center space-x-2">
            {approvalProcess ? (
              getStateIcon(approvalProcess?.state)
            ) : (
              <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            <span>Estado del Proceso de Aprobación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Estado Actual:
            </span>
            <Badge variant={getStateColor(approvalProcess?.state || "")}>
              {approvalProcess?.state
                ? getStateName(approvalProcess?.state)
                : "Sin estado"}
            </Badge>
          </div>

          {/* Categories Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Approved Categories */}
            <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Categorías Aprobadas (
                {approvalProcess?.approvedCategories?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {(approvalProcess?.approvedCategories?.length ?? 0 > 0) ? (
                  approvalProcess?.approvedCategories.map((category) => (
                    <CategoryItem 
                      key={category.id}
                      category={category}
                      onClick={openCategoryModal}
                      status="approved"
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No tiene categorías aprobadas
                  </p>
                )}
              </div>
            </div>

            {/* Pending Categories */}
            <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                Categorías Pendientes (
                {approvalProcess?.pendingCategories?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {(approvalProcess?.pendingCategories?.length ?? 0 > 0) ? (
                  approvalProcess?.pendingCategories.map((category) => (
                    <CategoryItem 
                      key={category.id}
                      category={category}
                      onClick={openCategoryModal}
                      status="pending"
                    />
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
            <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Documentos Aprobados (
                {approvalProcess?.approvedDocuments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {(approvalProcess?.approvedDocuments?.length ?? 0 > 0) ? (
                  approvalProcess?.approvedDocuments.map((document) => (
                    <DocumentItem
                      key={document.id}
                      document={document}
                      status="approved"
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No tiene documentos aprobados
                  </p>
                )}
              </div>
            </div>

            {/* Pending Documents */}
            <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                Documentos Pendientes (
                {approvalProcess?.pendingDocuments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {(approvalProcess?.pendingDocuments?.length ?? 0) > 0 ? (
                  approvalProcess?.pendingDocuments?.map((document) => (
                    <DocumentItem
                      key={document.id}
                      document={document}
                      status="pending"
                    />
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
  );
}
