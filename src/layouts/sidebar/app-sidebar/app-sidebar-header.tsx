"use client";
import { toggleSidebar } from "@/store/themeConfigSlice";
import { ChevronLeftIcon } from "lucide-react";
import { ReactNode } from "react";

import { useDispatch } from "react-redux";

export const AppSidebarHeader = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      {children}

      <button
        type="button"
        className="collapse-icon flex h-8 w-8 items-center justify-center rounded-md transition duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle Sidebar"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
