import LoginPage from "@/auth-sso/components/login-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | ZAS Express",
  description: "Accede al panel de administración del sistema ZAS. ",
};

export default function Home() {
  return <LoginPage />;
}
