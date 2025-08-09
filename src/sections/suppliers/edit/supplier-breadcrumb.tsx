"use client";
import Breadcrumb from "@/components/breadcrumbs/breadcrumbs";
import { SupplierDetails } from "@/types/suppliers";
import React from "react";

function SupplierBreadcrumb({
  supplierDetails,
}: {
  supplierDetails: SupplierDetails;
}) {
  return (
    <Breadcrumb
      items={[
        {
          label: "Dashboard",
          onClick: () => (window.location.href = "/dashboard"),
        },
        {
          label: "Proveedores",
          onClick: () => (window.location.href = "/dashboard/suppliers"),
        },
        {
          label: `Editar ${supplierDetails.name}`,
        },
      ]}
      className="mb-4"
    />
  );
}

export default SupplierBreadcrumb;
