"use client";
import { ChevronDown, Minus } from "lucide-react";
import Link from "next/link";
import AnimateHeight from "react-animate-height";
import { SidebarItemProps } from "./types";
import { usePermissions } from "@/hooks/use-permissions";

const SidebarItem = ({
  item,
  active,
  isExpanded,
  onToggle,
  isActiveLink,
}: SidebarItemProps) => {
  // Obtener permisos del usuario usando el hook personalizado
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
          <Link href={item.path}>
            <div
              className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                active
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary/60"
                  : "text-muted-foreground hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center space-x-3 ">
                <div
                  className={`shrink-0 transition-colors duration-200 flex items-center justify-center ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  <div
                    className={`${active ? "text-primary" : "border-current/40 group-hover:border-primary/60"}`}
                  >
                    <Minus className="h-4 w-4" />
                  </div>
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium shadow-sm bg-primary/10 text-primary`}
                  >
                    {item.badge.text}
                  </span>
                )}
                {hasSubsections && item.isCollapsible && (
                  <ChevronDown
                    className={`h-4 w-4 transition-all duration-200 ${
                      isExpanded
                        ? "rotate-180 text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
              active
                ? "bg-primary/10 text-primary border-l-[3px] border-primary/60"
                : "text-muted-foreground hover:bg-primary/5"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`shrink-0 transition-colors duration-200 flex items-center justify-center ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full border ${
                    active
                      ? "bg-primary border-primary/60"
                      : "border-current/40 group-hover:border-primary/60"
                  }`}
                ></div>
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              >
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium shadow-sm bg-primary/10 text-primary`}
                >
                  {item.badge.text}
                </span>
              )}
              {hasSubsections && item.isCollapsible && (
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isExpanded
                      ? "rotate-180 text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subsections */}
      {hasSubsections && item.subsections && (
        <AnimateHeight
          duration={260}
          height={isExpanded ? "auto" : 0}
          animateOpacity
          easing="cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <div
            className="mt-3 ml-6 pl-3 border-l-2 border-primary/20"
            aria-hidden={!isExpanded}
          >
            {item.subsections.map((subsection) => (
              <div key={subsection.id} className="mb-4">
                <h4 className="mb-2 px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {subsection.label}
                </h4>
                <ul className="space-y-1">
                  {filterByPermissions(subsection.items).map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        href={subItem.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors relative ${
                          isActiveLink(subItem.path)
                            ? "bg-primary/10 text-primary border-l-[3px] border-primary/60 font-medium"
                            : "text-muted-foreground hover:bg-primary/5"
                        } ${subItem.disabled ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors ${
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
