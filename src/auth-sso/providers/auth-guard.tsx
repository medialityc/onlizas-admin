"use client";
import Loading from "@/layouts/loading";
import useRefreshSession from "../hooks/use-refresh-session";
import { SessionExpiredAlert } from "../components/session-expired-alert";
import { usePathname, forbidden } from "next/navigation";
import usePermissions from "../hooks/use-permissions";
import {
  ACTIVE_PERMISSIONS,
  resolveRoutePermissions,
} from "../config/route-permissions.client";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Readonly<Props>) {
  const { session, error } = useRefreshSession();
  const pathname = usePathname();
  const perms = usePermissions();

  // Loading states
  if (session.isLoading || (!perms.isLoaded && ACTIVE_PERMISSIONS)) {
    return <Loading />;
  }

  // Si hay error de sesión, mostramos alerta y dejamos seguir (p.ej. para que pantalla de login se encargue)
  if (error) {
    return (
      <>
        <SessionExpiredAlert type="error" />
        {children}
      </>
    );
  }

  if (ACTIVE_PERMISSIONS) {
    const required = resolveRoutePermissions(pathname || "");

    if (required.length) {
      const ok = required.some(perms.has);
      if (!ok) {
        return forbidden();
      }
    }
  }

  return <>{children}</>;
}
