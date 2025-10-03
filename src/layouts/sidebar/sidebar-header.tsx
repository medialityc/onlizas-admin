"use client";
import IconCaretsDown from "@/components/icon/icon-carets-down";
import Logo from "@/components/logo/logo";
import { toggleSidebar } from "@/store/themeConfigSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";

const SidebarHeader = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link href="/" className="main-logo flex shrink-0 items-center">
        <div className="py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Logo className="h-6 w-auto text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Panel de Control
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Onlizas
              </p>
            </div>
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
