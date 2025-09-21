"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AnimateHeight from "react-animate-height";
import { SidebarItemProps } from "./types";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

const SidebarItem = ({
  item,
  isActive,
  isExpanded,
  onToggle,
  isActiveLink,
}: SidebarItemProps) => {
  // Obtener permisos del usuario
  const { data: permissions = [] } = usePermissions();

  // Función helper para verificar permisos
  const hasPermission = (requiredPermissions?: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every(perm => permissions.some(p => p.code === perm));
  };

  // Si no tiene permisos, no renderizar el item
  if (!hasPermission(item.permissions)) {
    return null;
  }
  const badgeColors = {
    primary: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    info: "bg-cyan-500 text-white",
  };

  const hasSubsections = item.subsections && item.subsections.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubsections && item.isCollapsible) {
      e.preventDefault();
      onToggle?.();
    }
  };

  return (
    <li>
      {/* Main item */}
      <div
        className={`group cursor-pointer transition-all duration-200 ${
          item.disabled ? "pointer-events-none opacity-50" : ""
        }`}
        onClick={handleClick}
      >
        {item.path && !hasSubsections ? (
          <Link href={item.path}>
            <div
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:shadow-sm ${
                isActive
                  ? "bg-primary/10 text-primary border-l-3 border-primary shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-primary"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium shadow-sm ${
                      badgeColors[item.badge.color || "primary"]
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
                {hasSubsections && item.isCollapsible && (
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-all duration-200 ${
                      isExpanded ? "rotate-180 text-primary" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:shadow-sm ${
              isActive
                ? "bg-primary/10 text-primary border-l-3 border-primary shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:text-primary"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-primary"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium shadow-sm ${
                    badgeColors[item.badge.color || "primary"]
                  }`}
                >
                  {item.badge.text}
                </span>
              )}
              {hasSubsections && item.isCollapsible && (
                <ChevronDownIcon
                  className={`h-4 w-4 transition-all duration-200 ${
                    isExpanded ? "rotate-180 text-primary" : "text-gray-400"
                  }`}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subsections */}
      {hasSubsections && item.subsections && (
        <AnimateHeight duration={300} height={isExpanded ? "auto" : 0}>
          <div className="mt-3 ml-6 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
            {item.subsections.map((subsection) => (
              <div key={subsection.id} className="mb-4">
                <h4 className="mb-2 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {subsection.label}
                </h4>
                <ul className="space-y-1">
                  {subsection.items
                    .filter((subItem) => hasPermission(subItem.permissions))
                    .map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        href={subItem.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:shadow-sm ${
                          isActiveLink(subItem.path)
                            ? "bg-primary/8 text-primary border-l-2 border-primary font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                        } ${subItem.disabled ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 mr-3"></div>
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimateHeight>
      )}
    </li>
  );
};

export default SidebarItem;
