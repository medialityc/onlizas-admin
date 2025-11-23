"use client";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/store/themeConfigSlice";

import IconMenu from "@/components/icon/icon-menu";
import themeConfig from "@/theme.config";
import NotificationsDropdown from "./notifications-dropdown";
import ThemeSwitcher from "./theme-switcher";
import UserProfileDropdown from "./user-profile-dropdown";
import Logo from "@/components/logo-component";

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
              <div className="relative cursor-pointer group rounded-xl px-2 py-1 flex items-center backdrop-blur-sm border border-primary/10 dark:border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 hover:from-primary/20 hover:via-primary/10 transition-colors">
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
                <Logo
                  width={80}
                  height={28}
                  className="h-6 w-auto flex-shrink-0 select-none transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 dropdown sm:flex-1 lg:space-x-2 justify-end">
            {/* <NotificationsDropdown /> */}
            <ThemeSwitcher />

            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
