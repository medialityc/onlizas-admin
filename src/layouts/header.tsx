"use client";
import { useAuth } from "@/auth-sso/hooks/use-auth";
import IconLaptop from "@/components/icon/icon-laptop";
import IconLogout from "@/components/icon/icon-logout";
import IconMenu from "@/components/icon/icon-menu";
import IconMoon from "@/components/icon/icon-moon";
import IconSun from "@/components/icon/icon-sun";
import IconUser from "@/components/icon/icon-user";
import Dropdown from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/themeConfigSlice";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// TODO: Componetizar

const Header = () => {
  const dispatch = useDispatch();
  const session = useAuth();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const isRtl =
    useSelector((state: RootState) => state.themeConfig.rtlClass) === "rtl";
  const user = session.user;
  const themeConfig = useSelector((state: RootState) => state.themeConfig);

  return (
    <header
      className={`z-40 ${themeConfig.menu === "horizontal" ? "dark" : ""}`}
    >
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-1.5   dark:text-[#d0d2d6] sm:flex-1  lg:space-x-2 justify-end">
            <div>
              {theme === "light" ? (
                <button
                  className={`${
                    theme === "light" &&
                    "flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <IconSun />
                </button>
              ) : (
                ""
              )}
              {theme === "dark" && (
                <button
                  className={`${
                    theme === "dark" &&
                    "flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <IconMoon />
                </button>
              )}
              {theme === "system" && (
                <button
                  className={`${
                    theme === "system" &&
                    "flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <IconLaptop />
                </button>
              )}
            </div>

            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="relative group block"
                button={
                  user?.photoUrl ? (
                    <Image
                      height={36}
                      width={36}
                      className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                      src={user?.photoUrl}
                      alt="userProfile"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                        session.isLoading && "animate-pulse"
                      )}
                    >
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )
                }
              >
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      {user?.photoUrl ? (
                        <Image
                          height={40}
                          width={40}
                          className="h-10 w-10 rounded-md object-cover"
                          src={user?.photoUrl}
                          alt="userProfile"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                            session.isLoading && "animate-pulse"
                          )}
                        >
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <div className="font-semibold text-base text-black dark:text-white mb-0.5">
                          {user?.name}
                        </div>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          {user?.emails[0].address}
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/users/profile"
                      className="dark:hover:text-white"
                    >
                      <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      Mi Perfil
                    </Link>
                  </li>

                  <li className="border-t border-white-light dark:border-white-light/10">
                    <button
                      onClick={async () => {
                        console.log("[FIX-AUTH] Cerrar sesión", session);
                        await session.clearSession();
                        router.push("/");
                      }}
                      className="!py-3 text-danger"
                    >
                      <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
