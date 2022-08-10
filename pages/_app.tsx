import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { useRouter } from "next/router";

import "../styles/globals.scss";

import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
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

  useEffect(() => storePathValues, [router.asPath]);

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    const prevPath = storage.getItem("currentPath");
    storage.setItem("prevPath", prevPath || "");
    storage.setItem("currentPath", globalThis.location.pathname);
    console.log(storage.getItem("prevPath"), storage.getItem("currentPath"));
  }

  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
