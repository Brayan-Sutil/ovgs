"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ToastContainer } from "react-toastify";
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
        {children}
        <ToastContainer
          autoClose={2500}
          closeOnClick
          draggable={false}
          hideProgressBar
          newestOnTop
          pauseOnHover
          position="top-right"
          theme="light"
        />
      </QueryClientProvider>
    </ReduxProvider>
  );
};
