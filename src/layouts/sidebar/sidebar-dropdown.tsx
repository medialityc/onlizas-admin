import Dropdown from "@/components/ui/dropdown";
import { ChevronDown, LayoutPanelLeft, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};
const SidebarDropdown = ({ title = "Panel de Control", subtitle }: Props) => {
  return (
    <div className="dropdown">
      <Dropdown
        placement={"bottom-start"}
        btnClassName="w-full dropdown-toggle"
        button={
          <div className="!min-w-[200px] flex items-center justify-between gap-2 font-medium text-gray-900 dark:text-white cursor-pointer py-1.5 px-1 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Image
                  className="w-8 h-8"
                  src="/assets/images/ZAS.svg"
                  alt="logo"
                  width={20}
                  height={20}
                />
              </div>
              <div className="flex flex-col gap-1 justify-start items-start">
                <p className="text-sm font-bold">{title}</p>
                <p className="text-xs text-gray-500 line-clamp-1 overflow-hidden text-ellipsis">
                  {subtitle}
                </p>
              </div>
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
  );
};

export default SidebarDropdown;
