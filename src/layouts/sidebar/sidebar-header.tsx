"use client";
import IconCaretsDown from "@/components/icon/icon-carets-down";
import Logo from "@/components/logo-component";
import { toggleSidebar } from "@/store/themeConfigSlice";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

const SidebarHeader = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link href="/" className="main-logo flex shrink-0 items-center ">
        <div className="flex items-center gap-1.5 py-1 w-full">
          <div className="relative cursor-pointer group rounded-xl px-2 py-1 flex items-center backdrop-blur-sm border border-primary/10 dark:border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 hover:from-primary/20 hover:via-primary/10 transition-colors">
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
            <Logo
              width={80}
              height={28}
              className="h-6 w-auto flex-shrink-0 select-none transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
              Panel de control
            </span>
            <span className="text-[9px] font-medium text-primary dark:text-primary/80">
              Onlizas
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
        onClick={() => dispatch(toggleSidebar())}
      >
        <IconCaretsDown className="m-auto rotate-90" />
      </button>
    </div>
  );
};

export default SidebarHeader;
