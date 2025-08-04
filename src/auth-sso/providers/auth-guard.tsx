"use client";
import Loading from "@/layouts/loading";
import useRefreshSession from "../hooks/use-refresh-session";
import { SessionExpiredAlert } from "../components/session-expired-alert";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Readonly<Props>) {
  const { session, error } = useRefreshSession();

  if (session.isLoading) <Loading />;
  return (
    <>
      {error && <SessionExpiredAlert type="error" />}
      {children}
    </>
  );
}
