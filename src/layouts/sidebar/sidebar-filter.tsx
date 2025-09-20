"use client";

import { SidebarSection } from './types';
import { useIsAdmin } from '@/auth-sso/permissions/hooks';

/**
 * Hook súper simple que filtra el sidebar basado en si es admin o no
 */
export function useFilteredSidebar(sections: SidebarSection[]): SidebarSection[] {
  const { data: isAdminUser = false, isLoading } = useIsAdmin();

  if (isLoading) {
    console.log("⏳ Cargando permisos...");
    return []; // Mientras carga, no mostrar nada
  }

  console.log("🎭 Filtering sidebar:", { isAdminUser, totalSections: sections.length });

  const filteredSections = sections.map(section => {
    console.log(`📁 Processing section: ${section.label}`, { 
      adminOnly: section.adminOnly, 
      isAdminUser,
      willShow: !section.adminOnly || isAdminUser 
    });

    // Si la sección requiere admin y el usuario no es admin, ocultarla
    if (section.adminOnly && !isAdminUser) {
      console.log(`❌ Hiding section: ${section.label} (admin only)`);
      return null;
    }

    // Filtrar items dentro de la sección (crear nueva copia)
    const filteredItems = section.items.filter(item => {
      console.log(`  📄 Processing item: ${item.label}`, { 
        adminOnly: item.adminOnly, 
        isAdminUser,
        willShow: !item.adminOnly || isAdminUser 
      });

      // Si el item requiere admin y el usuario no es admin, ocultarlo
      if (item.adminOnly && !isAdminUser) {
        console.log(`  ❌ Hiding item: ${item.label} (admin only)`);
        return false;
      }
      return true;
    });

    console.log(`✅ Section ${section.label}: ${filteredItems.length}/${section.items.length} items visible`);

    // Si no hay items visibles después del filtro, ocultar toda la sección
    if (filteredItems.length === 0) {
      console.log(`❌ Hiding section: ${section.label} (no visible items)`);
      return null;
    }

    // Retornar una nueva copia de la sección con los items filtrados
    return {
      ...section,
      items: filteredItems
    };
  }).filter(Boolean) as SidebarSection[]; // Eliminar secciones null

  console.log("🎯 Final filtered sections:", filteredSections.map(s => s.label));

  return filteredSections;
}