import ContentAnimation from "./content-animation";
import Footer from "./footer";
import Header from "./header";
import MainContainer from "./main-container";
import ScrollToTop from "./scroll-to-top";
import Portals from "./portals";
import SidebarProvider from "./sidebar/sidebar-provider/sidebar-provider";

export default function DashboardProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* BEGIN MAIN CONTAINER */}
      <div className="relative">
        <ScrollToTop />
        <MainContainer>
          {/* BEGIN SIDEBAR */}
          <SidebarProvider />
          {/* END SIDEBAR */}
          <div className="main-content bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex min-h-screen flex-col">
            {/* BEGIN TOP NAVBAR */}
            <Header />
            {/* END TOP NAVBAR */}

            {/* BEGIN CONTENT AREA */}
            <ContentAnimation>{children}</ContentAnimation>
            {/* END CONTENT AREA */}

            {/* BEGIN FOOTER */}
            <Footer />
            {/* END FOOTER */}
            <Portals />
          </div>
        </MainContainer>
      </div>
    </>
  );
}
