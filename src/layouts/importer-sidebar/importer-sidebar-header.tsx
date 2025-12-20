"use client";

import { ShieldCheckIcon } from "@heroicons/react/24/solid";

const ImporterSidebarHeader = () => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative cursor-pointer group rounded-xl px-2 py-1 flex items-center backdrop-blur-sm border border-emerald-500/20 dark:border-emerald-500/30 bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 hover:from-emerald-500/20 hover:via-emerald-500/10 transition-colors">
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
        <ShieldCheckIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] font-bold text-gray-800 dark:text-gray-100 tracking-wide">
          Portal Importadoras
        </span>
        <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
          Sistema de Gestión
        </span>
      </div>
    </div>
  );
};

export default ImporterSidebarHeader;
