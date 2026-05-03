import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import { SessionProvider } from "@/features/auth/context/SessionContext";
import { AppThemeProvider } from "@/shared/theme/AppThemeProvider";

export function AppProviders({
  children
}: PropsWithChildren): React.JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false
          },
          mutations: {
            retry: 0
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <SessionProvider>
          <StatusBar style="dark" />
          {children}
        </SessionProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
