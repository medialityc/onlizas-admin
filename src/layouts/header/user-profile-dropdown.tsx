"use client";
import Dropdown from "@/components/ui/dropdown";
import Image from "next/image";
import IconUser from "@/components/icon/icon-user";
import IconLogout from "@/components/icon/icon-logout";
import { redirectToLogin, useAuth } from "zas-sso-client";
import { cn } from "@/lib/utils";

export default function UserProfileDropdown() {
  const session = useAuth();
  const user = session.user;


  return (
    <Dropdown
      offset={[0, 8]}
      placement="bottom-end"
      btnClassName="relative group block"
      button={
        user?.photoUrl ? (
          <Image
            height={36}
            width={36}
            className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
            src={user.photoUrl}
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
      <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark">
        <li>
          <div className="flex items-center px-4 py-4">
            {user?.photoUrl ? (
              <Image
                height={40}
                width={40}
                className="h-10 w-10 rounded-md object-cover"
                src={user.photoUrl}
                alt="userProfile"
              />
            ) : null}
            <div className="truncate ltr:pl-4 rtl:pr-4">
              <div className="font-semibold text-base text-black dark:text-white mb-0.5">
                {user?.name}
              </div>
              <button className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                {user?.emails?.[0]?.address}
              </button>
            </div>
          </div>
        </li>
        <li>
          <a
            href="/dashboard/profile"
            className="dark:hover:text-white flex items-center"
          >
            <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
            Mi Perfil
          </a>
        </li>
        <li className="border-t border-white-light dark:border-white-light/10">
          <button
            onClick={async () => {
              await session.signOut();
              redirectToLogin({ preservePath: true });
            }}
            className="!py-3 text-danger flex items-center"
          >
            <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </Dropdown>
  );
}
