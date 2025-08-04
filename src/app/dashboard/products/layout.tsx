import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos - ZAS Express",
  description: "Gestión de productos del sistema",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
