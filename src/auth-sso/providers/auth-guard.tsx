"use client";
import Loading from "@/layouts/loading";
import useRefreshSession from "../hooks/use-refresh-session";
import { SessionExpiredAlert } from "../components/session-expired-alert";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Readonly<Props>) {
  const { session, error } = useRefreshSession();

  // Loading states
  if (session.isLoading) {
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

  // if (ACTIVE_PERMISSIONS) {
  //   const required = resolveRoutePermissions(pathname || "");

  //   if (required.length) {
  //     const ok = required.some(perms.has);
  //     if (!ok) {
  //       return forbidden();
  //     }
  //   }
  // }

  return <>{children}</>;
}
