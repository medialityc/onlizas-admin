import SupplierTabs from "@/sections/suppliers/list/supplier-tabs";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Gestión de Solicitud de Proveedores
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra las solicitudes de proveedores del sistema y sus datos
              asociados
            </p>
          </div>
        </div>
      </div>
      <SupplierTabs />
      {children}
    </div>
  );
}
