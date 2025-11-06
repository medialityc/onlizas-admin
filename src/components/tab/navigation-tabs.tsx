"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  UserGroupIcon,
  UserMinusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  users: UsersIcon,
  usersMinus: UserMinusIcon,
  usersGroup: UserGroupIcon,
  buildingLibrary: BuildingLibraryIcon,
  buildingStorefront: BuildingStorefrontIcon,
  buildingOffice: BuildingOfficeIcon,
};

export interface TabItem {
  label: string;
  href: string;
  icon?: string;
  count?: number;
  id?: string;
  disabled?: boolean;
}

interface NavigationTabsProps {
  tabs: TabItem[];
  className?: string;
  hidden?: boolean; // if true, do not render tabs
}

export function NavigationTabs({
  tabs,
  className,
  hidden,
}: NavigationTabsProps) {
  const pathname = usePathname();

  if (hidden) return null;

  return (
    <div
      className={cn("border-b border-gray-200 dark:border-gray-700", className)}
    >
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const IconComponent = tab.icon ? ICONS[tab.icon] : undefined;

          return (
            <Link
              key={tab.href}
              href={tab.disabled ? "#" : tab.href}
              className={cn(
                "group inline-flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors",
                active
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                if (tab.disabled) {
                  e.preventDefault();
                }
              }}
            >
              {IconComponent && (
                <IconComponent
                  className={cn(
                    "size-5",
                    active
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  )}
                />
              )}

              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    active
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
