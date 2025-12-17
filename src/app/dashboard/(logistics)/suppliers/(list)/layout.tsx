import SupplierTabs from "@/sections/suppliers/list/supplier-tabs";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Gestión de Solicitud de Proveedores
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administra las solicitudes de proveedores del sistema y sus datos
            asociados
          </p>
        </div>
      </div>
      <SupplierTabs />
      {children}
    </div>
  );
}
