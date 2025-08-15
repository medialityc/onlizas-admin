"use client";
import { useEffect, useMemo, useState } from "react";
import SidebarItem from "./sidebar-provider-item";
import IconCaretsDown from "@/components/icon/icon-carets-down";
import { SidebarSectionProps } from "../types";
import SidebarProviderItem from "./sidebar-provider-item";

const SidebarProviderSection = ({
  section,
  isActiveLink,
  expandedItems,
  onToggleItem,
}: SidebarSectionProps) => {
  // Detecta si algún item de la sección está activo, para abrir por defecto
  const hasActiveItem = useMemo(
    () =>
      section.items.some((item) =>
        item.path ? isActiveLink(item.path) : false
      ),
    [section.items, isActiveLink]
  );

  // Estado local de apertura/cierre del acordeón
  const [isOpen, setIsOpen] = useState<boolean>(
    () => hasActiveItem || expandedItems[section.id]
  );

  // Si cambia el item activo, autoexpande la sección
  useEffect(() => {
    if (hasActiveItem) setIsOpen(true);
  }, [hasActiveItem]);

  const handleToggleSection = () => setIsOpen((v) => !v);
  const contentId = `sidebar-section-${section.id}-content`;
  const buttonId = `sidebar-section-${section.id}-button`;

  return (
    <li className="mb-6">
      {!section.noSection && (
        <div className="mb-2">
          <div className="relative">
            <button
              type="button"
              onClick={handleToggleSection}
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={contentId}
              className="w-full px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-primary/5 border-l-4 border-primary border-r-4 rounded-lg shadow-sm backdrop-blur-sm flex items-center justify-between"
            >
              <span className="flex items-center space-x-2">
                <span>{section.label}</span>
              </span>
              <IconCaretsDown
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {/* Línea decorativa */}
            <div className="absolute -bottom-1 left-4 right-4 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          </div>
        </div>
      )}

      {/* Items de la sección (acordeón) */}
      {section.noSection ? (
        <ul className="space-y-1">
          {section.items.map((item) => (
            <SidebarProviderItem
              key={item.id}
              item={item}
              isActive={item.path ? isActiveLink(item.path) : false}
              isExpanded={expandedItems[item.id]}
              onToggle={() => onToggleItem(item.id)}
              isActiveLink={isActiveLink}
            />
          ))}
        </ul>
      ) : (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <ul className="space-y-1 overflow-hidden">
            {section.items.map((item) => (
              <SidebarProviderItem
                key={item.id}
                item={item}
                isActive={item.path ? isActiveLink(item.path) : false}
                isExpanded={expandedItems[item.id]}
                onToggle={() => onToggleItem(item.id)}
                isActiveLink={isActiveLink}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default SidebarProviderSection;
