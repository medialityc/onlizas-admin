"use client";
import IconCaretsDown from "@/components/icon/icon-carets-down";
import { toggleSidebar } from "@/store/themeConfigSlice";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

const SidebarHeader = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link href="/" className="main-logo flex shrink-0 items-center">
        <Image
          className="ml-[5px] w-8 flex-none pt-3"
          src="/assets/images/ZAS.svg"
          alt="logo"
          width={32}
          height={32}
        />
        <span className="align-middle text-blue-600 text-2xl font-bold ltr:ml-1.5 rtl:mr-1.5 dark:text-blue-400 lg:inline">
          OnliZas
        </span>
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
