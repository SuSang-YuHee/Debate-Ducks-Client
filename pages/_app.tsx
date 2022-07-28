import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import "../styles/globals.scss";
import Head from "next/head";

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
          <meta name="author" content="SuSang-YuHee" />
          <meta name="description" content="Real-time debating platform." />
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="./favicon.ico" />
          <link rel="apple-touch-icon" href="./favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"
          />
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
