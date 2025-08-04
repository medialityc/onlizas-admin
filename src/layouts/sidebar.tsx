"use client";
import IconCaretsDown from "@/components/icon/icon-carets-down";

import { paths } from "@/config/paths";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/themeConfigSlice";
import {
  CubeIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  TagIcon,
  HashtagIcon,
  QueueListIcon,
  MapPinIcon,
  CreditCardIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const pathname = usePathname();
  const themeConfig = useSelector((state: RootState) => state.themeConfig);

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const setActiveRoute = () => {
    const allLinks = document.querySelectorAll(".sidebar ul a.active");
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove("active");
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    selector?.classList.add("active");
  };

  const isActiveLink = (path: string) => {
    if (path === paths.dashboard.root) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className={theme == "dark" ? "dark" : ""}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${theme == "dark" ? "text-white-dark" : ""}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <Image
                className="ml-[5px] w-8 flex-none"
                src="/assets/images/logo.svg"
                alt="logo"
                width={32}
                height={32}
              />
              <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                ZAS ADMIN
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
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              {/* Sección: Panel Principal */}
              <li className="mb-2 mt-4 text-xs font-bold uppercase text-gray-400 dark:text-gray-600">
                Panel Principal
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.root}
                  className={`group ${isActiveLink(paths.dashboard.root) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <CubeIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.root) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Dashboard
                    </span>
                  </div>
                </Link>
              </li>

              {/* Sección: Gestión Financiera */}
              <li className="mb-2 mt-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-600">
                Gestión Financiera
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.businessRates.list}
                  className={`group ${isActiveLink(paths.dashboard.businessRates.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <CurrencyDollarIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.businessRates.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Tarifas de Negocios
                    </span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.exchangeRates.list}
                  className={`group ${isActiveLink(paths.dashboard.exchangeRates.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <CurrencyDollarIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.exchangeRates.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Tasas de Cambio
                    </span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.paymentMethods.list}
                  className={`group ${isActiveLink(paths.dashboard.paymentMethods.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <CreditCardIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.paymentMethods.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Métodos de Pago
                    </span>
                  </div>
                </Link>
              </li>

              {/* Sección: Gestión de Órdenes */}
              <li className="mb-2 mt-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-600">
                Gestión de Órdenes
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.orderStatus.list}
                  className={`group ${isActiveLink(paths.dashboard.orderStatus.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <QueueListIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.orderStatus.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Estados de Orden
                    </span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.shippingTypes.list}
                  className={`group ${isActiveLink(paths.dashboard.shippingTypes.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <MapPinIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.shippingTypes.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Tipos de Envío
                    </span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.hblRange.list}
                  className={`group ${isActiveLink(paths.dashboard.hblRange.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <HashtagIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.hblRange.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Rangos HBL
                    </span>
                  </div>
                </Link>
              </li>

              {/* Sección: Configuración del Sistema */}
              <li className="mb-2 mt-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-600">
                Configuración del Sistema
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.products.list}
                  className={`group ${isActiveLink(paths.dashboard.products.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <ArchiveBoxIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.products.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Productos
                    </span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.categories.list}
                  className={`group ${isActiveLink(paths.dashboard.categories.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <TagIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.categories.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Categorías
                    </span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={paths.dashboard.units.list}
                  className={`group ${isActiveLink(paths.dashboard.units.list) ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <BanknotesIcon
                      className={`shrink-0 group-hover:!text-primary ${isActiveLink(paths.dashboard.units.list) ? "text-primary" : " text-black/50 dark:text-white/50"}`}
                    />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      Unidades
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
