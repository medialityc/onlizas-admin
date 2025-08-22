import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
// 👇 Import the mantine-core layer CSS file;
//    this will automatically place it in a `mantine` layer

import "@mantine/core/styles.layer.css";

// 👇 Import the mantine-datatable layer CSS file;
//    this will automatically place it in a `mantine-datatable` layer
import "mantine-datatable/styles.layer.css";

import ProviderComponent from "@/layouts/provider-component";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "./styles/tailwind.css";
import "react-phone-number-input/style.css";
import { mantineHtmlProps } from "@mantine/core";

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ZAS Express | Panel de Administración",
  description:
    "Panel de administración para el sistema ZAS - Gestión de usuarios, subsistemas, seguimiento y configuraciones del sistema.",
  keywords: [
    "ZAS",
    "admin",
    "panel",
    "administración",
    "usuarios",
    "seguimiento",
    "subsistemas",
  ],
  authors: [{ name: "ZAS Team" }],
  creator: "ZAS Team",
  applicationName: "ZAS Express",
  generator: "Next.js",
  robots: "noindex, nofollow", // Admin panel should not be indexed
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "ZAS Express | Panel de Administración",
    description:
      "Panel de administración para el sistema ZAS - Gestión completa del sistema.",
    siteName: "ZAS Express",
  },
  twitter: {
    card: "summary",
    title: "ZAS Express | Panel de Administración",
    description:
      "Panel de administración para el sistema ZAS - Gestión completa del sistema.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html {...mantineHtmlProps}>
      <body className={nunito.variable}>
        <NextTopLoader
          color="#2563EB"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563EB,0 0 5px rgba(67,97,238,.15)"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={999}
          showAtBottom={false}
        />
        <ProviderComponent>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
            <ToastContainer />
          </ThemeProvider>
        </ProviderComponent>
      </body>
    </html>
  );
}
