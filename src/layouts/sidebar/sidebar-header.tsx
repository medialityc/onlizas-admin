"use client";
import Dropdown from "@/components/ui/dropdown";
import { toggleSidebar } from "@/store/themeConfigSlice";
import {
  ChevronDown,
  ChevronLeftIcon,
  LayoutPanelLeft,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useDispatch } from "react-redux";

const SidebarHeader = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="dropdown">
        <Dropdown
          placement={"bottom-start"}
          btnClassName="w-full dropdown-toggle"
          button={
            <div className="!min-w-[200px] flex items-center justify-between gap-2 font-medium text-gray-900 dark:text-white cursor-pointer py-1.5 px-1 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Image
                    className="w-5 h-5"
                    src="/assets/images/ZAS.svg"
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-sm">Panel de Control</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          }
        >
          <ul className="!min-w-[200px] mt-1">
            <li>
              <Link href="/dashboard" className="block w-full">
                <button
                  type="button"
                  className="flex items-center gap-2  text-left h-full w-full text-sm "
                >
                  <LayoutPanelLeft className="mr-2 w-5 h-5" />
                  Dashboard
                </button>
              </Link>
            </li>
            <li>
              <Link href="/provider" className="block w-full">
                <button
                  type="button"
                  className="flex items-center gap-2 w-full text-left text-sm "
                >
                  <UsersIcon className="mr-2 w-5 h-5" />
                  Proveedor
                </button>
              </Link>
            </li>
          </ul>
        </Dropdown>
      </div>

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

export default SidebarHeader;
