"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AnimateHeight from "react-animate-height";
import { SidebarItemProps } from "./types";

const SidebarItem = ({
  item,
  isActive,
  isExpanded,
  onToggle,
  isActiveLink,
}: SidebarItemProps) => {
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
    <li className="nav-item">
      {/* Main item */}
      <div
        className={`group cursor-pointer ${isActive ? "active" : ""} ${
          item.disabled ? "pointer-events-none opacity-50" : ""
        }`}
        onClick={handleClick}
      >
        {item.path && !hasSubsections ? (
          <Link href={item.path}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`shrink-0 group-hover:!text-primary ${
                    isActive
                      ? "text-primary"
                      : "text-black/50 dark:text-white/50"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-textColor text-xs ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      badgeColors[item.badge.color || "primary"]
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
                {hasSubsections && item.isCollapsible && (
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`shrink-0 group-hover:!text-primary ${
                  isActive ? "text-primary" : "text-black/50 dark:text-white/50"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-textColor text-xs ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    badgeColors[item.badge.color || "primary"]
                  }`}
                >
                  {item.badge.text}
                </span>
              )}
              {hasSubsections && item.isCollapsible && (
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
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
          <div className="mt-2 ml-6">
            {item.subsections.map((subsection) => (
              <div key={subsection.id} className="mb-2">
                <h4 className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  {subsection.label}
                </h4>
                <ul className="space-y-1">
                  {subsection.items.map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        href={subItem.path}
                        className={`block py-1 px-3 text-xs rounded transition-colors ${
                          isActiveLink(subItem.path)
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        } ${subItem.disabled ? "pointer-events-none opacity-50" : ""}`}
                      >
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
