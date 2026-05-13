"use client";
import App from "@/App";
import { store } from "@/store";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, Suspense } from "react";
import { Provider } from "react-redux";
import Loading from "./loading";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/es.json";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const locale = process.env.NEXT_PUBLIC_LOCALE || "es";

interface IProps {
  children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Loading />}>
            <MantineProvider>
              <App>{children} </App>
            </MantineProvider>
          </Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </NextIntlClientProvider>
  );
};

export default ProviderComponent;
