import React from "react";
import AnimateHeight from "react-animate-height";
import { SidebarMenuItem } from "./types";
import Link from "next/link";

interface Props {
  isExpanded?: boolean;
  item: SidebarMenuItem;
  isActiveLink: (path: string) => boolean;
}

const SidebarSubItems = ({ isExpanded, item, isActiveLink }: Props) => {
  return (
    <AnimateHeight
      duration={260}
      height={isExpanded ? "auto" : 0}
      animateOpacity
      easing="cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <div
        className="mt-3 ml-6 pl-3 border-l-2 border-gray-100 dark:border-gray-800"
        aria-hidden={!isExpanded}
      >
        {item.subsections!.map((subsection) => (
          <div key={subsection.id} className="mb-4">
            <h4 className="mb-2 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {subsection.label}
            </h4>
            <ul className="space-y-1">
              {subsection.items.map((subItem) => (
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
  );
};

export default SidebarSubItems;
