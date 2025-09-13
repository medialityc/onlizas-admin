"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuItem } from "../types";
import { cn } from "@/lib/utils";

interface Props {
  sections: SidebarMenuItem[];
}

export const AppSidebarContent = ({ sections }: Props) => {
  const pathname = usePathname();

  return (
    <div className="relative max-h-[calc(100vh-80px)] overflow-auto ultra-thin-scrollbar bg-white dark:bg-gray-900">
      <div className="px-2 py-4">
        <ul className="space-y-2">
          {sections.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  href={item.path!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ",

                    isActive
                      ? "bg-green-600  font-medium text-slate-100"
                      : "hover:bg-green-600/80 hover:text-slate-50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
