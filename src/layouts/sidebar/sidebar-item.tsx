"use client";
import { ChevronDown, Minus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimateHeight from "react-animate-height";
import { SidebarItemProps } from "./types";
import { usePermissions } from "@/hooks/use-permissions";

const SidebarItem = ({
  item,
  isActive,
  isExpanded,
  onToggle,
  isActiveLink,
}: SidebarItemProps) => {
  // Obtener permisos del usuario usando el hook personalizado
  const router = useRouter();
  const { hasPermission, filterByPermissions } = usePermissions();

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
          <Link
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              const qs = new URLSearchParams();
              router.push(`${item.path}?${qs.toString()}`);
            }}
          >
            <div
              className={`hover:bg-primary/5 flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 hover:shadow-sm ${
                isActive
                  ? "bg-primary/10 text-primary border-l-primary border-l-[3px] shadow-sm"
                  : "hover:text-primary text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex shrink-0 items-center justify-center transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "group-hover:text-primary text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <div
                    className={` ${
                      isActive
                        ? "text-primary"
                        : "group-hover:border-primary/60 border-current/40"
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </div>
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
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
                  <ChevronDown
                    className={`h-4 w-4 transition-all duration-200 ${
                      isExpanded ? "text-primary rotate-180" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div
            className={`hover:bg-primary/5 flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 hover:shadow-sm ${
              isActive
                ? "bg-primary/10 text-primary border-primary border-l-3 shadow-sm"
                : "hover:text-primary text-gray-700 dark:text-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`flex shrink-0 items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "group-hover:text-primary text-gray-400 dark:text-gray-500"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full border ${
                    isActive
                      ? "border-primary bg-primary/80 shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.15)]"
                      : "group-hover:border-primary/60 border-current/40"
                  }`}
                ></div>
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
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
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isExpanded ? "text-primary rotate-180" : "text-gray-400"
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
          <div className="mt-3 ml-6 border-l-2 border-gray-100 pl-3 dark:border-gray-800">
            {item.subsections.map((subsection) => (
              <div key={subsection.id} className="mb-4">
                <h4 className="mb-2 px-2 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  {subsection.label}
                </h4>
                <ul className="space-y-1">
                  {subsection.items.map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        href={subItem.path}
                        className={`relative flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:shadow-sm ${
                          isActiveLink(subItem.path)
                            ? "bg-primary/10 text-primary border-primary ring-primary/20 border-l-2 font-medium ring-1"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                        } ${subItem.disabled ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <div
                          className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${
                            isActiveLink(subItem.path)
                              ? "bg-primary"
                              : "bg-current opacity-50 group-hover:opacity-70"
                          }`}
                        ></div>
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
