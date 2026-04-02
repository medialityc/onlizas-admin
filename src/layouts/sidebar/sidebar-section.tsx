"use client";
import {
  Boxes,
  ChartBar,
  ChartScatter,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Globe2,
  LayoutDashboard,
  ListOrdered,
  LucideIcon,
  PackageSearch,
  Shield,
  Store,
  StoreIcon,
  Warehouse,
} from "lucide-react";
import AnimateHeight from "react-animate-height";
import SidebarItem from "./sidebar-item";
import { SidebarSectionProps } from "./types";
import { usePermissions } from "@/hooks/use-permissions";

const SidebarSection = ({
  section,
  isActiveLink,
  expandedItems,
  onToggleItem,
  hasActiveSearch = false,
}: SidebarSectionProps & { hasActiveSearch?: boolean }) => {
  // Obtener permisos del usuario usando el hook personalizado
  const { hasPermission, filterByPermissions } = usePermissions();

  // Si no tiene permisos, no renderizar el item
  if (!hasPermission(section.permissions)) {
    return null;
  }
  const sectionExpanded = expandedItems[section.id] ?? true; // fallback abierto

  const SECTION_ICONS: Record<string, LucideIcon> = {
    dashboard: ChartScatter,
    sales: ListOrdered,
    catalog: StoreIcon,
    payments: DollarSign,
    inventory: Boxes,
    finance: ChartBar,
    security: Shield,
  };
  const ICON = SECTION_ICONS[section.id] ?? LayoutDashboard;

  // Determine if any item (or group item) inside is active for path highlighting
  const sectionActive =
    section.items.some((i) => i.path && isActiveLink(i.path)) ||
    section.groups?.some((g) =>
      g.items.some((i) => i.path && isActiveLink(i.path)),
    ) ||
    false;

  return (
    <li>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => onToggleItem(section.id)}
          className={`group flex w-full items-center justify-between rounded-lg border-r-4 border-l-4 px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm transition-colors ${
            sectionActive
              ? "bg-primary/15 border-primary text-primary"
              : "bg-primary/5 border-primary hover:bg-primary/10 text-gray-700 dark:text-gray-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-primary/70 group-hover:text-primary transition-colors">
              <ICON className="size-4" />
            </span>
            <span className={sectionActive ? "text-primary" : ""}>
              {section.label}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              sectionExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
      </div>

      <AnimateHeight
        height={sectionExpanded ? "auto" : 0}
        duration={260}
        animateOpacity
      >
        {sectionExpanded && (
          <div className="space-y-4">
            {section.items && section.items.length > 0 && (
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={item.path ? isActiveLink(item.path) : false}
                    isExpanded={expandedItems[item.id]}
                    onToggle={() => onToggleItem(item.id)}
                    isActiveLink={isActiveLink}
                  />
                ))}
              </ul>
            )}
            {section.groups && section.groups.length > 0 && (
              <div className="space-y-2">
                {section.groups.map((group) => {
                  const groupId = `${section.id}:${group.id}`;
                  const groupExpanded = hasActiveSearch
                    ? true
                    : (expandedItems[groupId] ?? true);
                  const collapsible = group.collapsible !== false;
                  const groupActive = group.items.some(
                    (i) => i.path && isActiveLink(i.path),
                  );
                  return (
                    <div
                      key={group.id}
                      className={`overflow-hidden rounded-md border transition-colors ${
                        groupActive
                          ? "border-primary/60 bg-primary/5"
                          : "border-gray-100 dark:border-gray-800"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => collapsible && onToggleItem(groupId)}
                        className={`flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                          groupActive
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900"
                        } ${collapsible ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span
                          className={`flex items-center gap-1 ${
                            groupActive
                              ? "text-primary"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <ChevronRight
                            className={`h-3 w-3 ${
                              groupExpanded ? "opacity-70" : "opacity-50"
                            }`}
                          />
                          {group.label}
                        </span>
                        {collapsible && (
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                              groupExpanded ? "rotate-0" : "-rotate-90"
                            }`}
                          />
                        )}
                      </button>
                      <AnimateHeight
                        height={groupExpanded ? "auto" : 0}
                        duration={220}
                        easing="cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <ul className="space-y-1 p-2">
                          {group.items.map((item) => (
                            <SidebarItem
                              key={item.id}
                              item={item}
                              isActive={
                                item.path ? isActiveLink(item.path) : false
                              }
                              isExpanded={expandedItems[item.id]}
                              onToggle={() => onToggleItem(item.id)}
                              isActiveLink={isActiveLink}
                            />
                          ))}
                        </ul>
                      </AnimateHeight>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </AnimateHeight>
    </li>
  );
};

export default SidebarSection;
