"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "@/auth/provider";
import { AppI18nProvider } from "@/i18n/provider";
import { store } from "@/lib/store";

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000
          }
        }
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppI18nProvider>{children}</AppI18nProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
