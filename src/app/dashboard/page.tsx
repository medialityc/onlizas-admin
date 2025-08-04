// TODO: Dejar separado pero empezar con la tabla de gestión de clientes

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | ZAS Express",
  description: "Admin dashboard overview with user statistics and analytics",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default function DashboardPage() {
  return <div>Dashboard</div>;
}
