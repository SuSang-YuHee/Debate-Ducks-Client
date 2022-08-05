import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

import "../styles/globals.scss";

import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            retry: false,
          },
        },
      }),
  );

  const [isToaster, setIsToaster] = useState<boolean>(false);

  useEffect(() => {
    setIsToaster(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          <title>Debate Ducks</title>
        </Head>
        {isToaster ? (
          <Toaster
            toastOptions={{
              position: "top-center",
              duration: 2000,
            }}
          />
        ) : null}
        <Header />
        <Component {...pageProps} />
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
