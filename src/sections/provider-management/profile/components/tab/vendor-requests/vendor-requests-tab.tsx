"use client";

import React, { useState, useMemo } from "react";
import { IUser, UserResponseMe } from "@/types/users";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useApprovalProcessRequest } from "../../../hooks/useApprovalProcessRequest";
import CategoryRequestModal from "../../modal/category-request-modal";
import ExpirationExtensionModal from "../../modal/expiration-extension-modal";
import { SupplierApprovalProcess } from "@/types/suppliers";

// Componentes divididos
import { ApprovalProcessStatus } from "./components/approval-process-status";
import { UserAttributesSection } from "./components/user-attributes-section";
import { VendorRequestForm } from "./components/vendor-request-form";

interface VendorRequestsTabProps {
  user: UserResponseMe | null;
  approvalProcess: SupplierApprovalProcess | null;
  isLoadingApproval: boolean;
}

export default function VendorRequestsTab({
  user,
  approvalProcess,
  isLoadingApproval,
}: VendorRequestsTabProps) {
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

  // Hook centralizado para manejo de solicitudes de aprobación
  const { submitCategoryRequest, submitExpirationExtension, isLoading } =
    useApprovalProcessRequest(() => {
      setCategoryModalOpen(false);
      setExpirationModalOpen(false);
    });

  const handleCategoryRequest = (data: any) => {
    submitCategoryRequest(user?.approvalProcessId || "", data);
  };

  const handleExpirationExtension = (data: any) => {
    submitExpirationExtension(user?.approvalProcessId || "", data);
  };

  const getStateColor = (state: string) => {
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

  const getStateName = (state: string) => {
    switch (state?.toLowerCase()) {
      case "approved":
        return "Aprobado";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazado";
      default:
        return "En proceso";
    }
  };

  return (
    <div className="space-y-6">
      {/* Approval Process Status */}
      <ApprovalProcessStatus
        approvalProcess={approvalProcess}
        isLoadingApproval={isLoadingApproval}
        getStateColor={getStateColor}
        getStateIcon={getStateIcon}
        getStateName={getStateName}
      />

      {/* User Attributes Section */}
      <UserAttributesSection approvalProcess={approvalProcess} />

      {/* Vendor Request Form */}
      <VendorRequestForm
        categoryModalOpen={categoryModalOpen}
        setCategoryModalOpen={setCategoryModalOpen}
        expirationModalOpen={expirationModalOpen}
        setExpirationModalOpen={setExpirationModalOpen}
      />

      {/* Modales */}
      <CategoryRequestModal
        isOpen={categoryModalOpen}
        existingIds={existingIds}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCategoryRequest}
        loading={isLoading}
      />

      <ExpirationExtensionModal
        isOpen={expirationModalOpen}
        onClose={() => setExpirationModalOpen(false)}
        onSubmit={handleExpirationExtension}
        loading={isLoading}
        currentExpirationDate={approvalProcess?.expirationDate || undefined}
      />
    </div>
  );
}
