import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Iniciar Sesión | ZAS Admin",
  description: "Accede al panel de administración del sistema ZAS. ",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default function Home() {
  redirect("/dashboard");
}
