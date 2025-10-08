"use client";
 
import { usePermissions } from "@/hooks/use-permissions";
import { SidebarSection } from "./types";

export const useFilteredSidebar = (
  sections: SidebarSection[]
): SidebarSection[] => {
  // Obtener permisos del usuario
  const { permissions } = usePermissions();

  // Función para filtrar items dentro de una sección
  const filterSectionItems = (
    section: SidebarSection
  ): SidebarSection | null => {
    const filteredItems = section.items.filter((item) => {
      const hasAccess =
        item.permissions?.every((perm) =>
          permissions?.some((p) => p.code === perm)
        ) ?? true;
      return hasAccess;
    });

    // Si no hay items visibles en la sección, no mostrar la sección
    if (filteredItems.length === 0) {
      return null;
    }

    return {
      ...section,
      items: filteredItems,
    };
  };

  // Filtrar secciones
  const filteredSections = sections
    .map(filterSectionItems)
    .filter((section): section is SidebarSection => section !== null);

  return filteredSections;
};
