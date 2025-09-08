"use client";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/store/themeConfigSlice";

import IconMenu from "@/components/icon/icon-menu";
import themeConfig from "@/theme.config";
import NotificationsDropdown from "./notifications-dropdown";
import ThemeSwitcher from "./theme-switcher";
import UserProfileDropdown from "./user-profile-dropdown";

export default function Header() {
  const dispatch = useDispatch();

  return (
    <header
      className={`z-40 ${themeConfig.menu === "horizontal" ? "dark" : ""}`}
    >
      <div className="shadow-sm border-b border-gray-200/60 dark:border-white/10">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="flex items-center gap-4">
            <div className="horizontal-logo flex gap-4 items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
              <button
                type="button"
                className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                onClick={() => dispatch(toggleSidebar())}
              >
                <IconMenu className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 dropdown sm:flex-1 lg:space-x-2 justify-end">
            <NotificationsDropdown />
            <ThemeSwitcher />
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
