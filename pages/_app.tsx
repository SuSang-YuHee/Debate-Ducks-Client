import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { useRouter } from "next/router";
import { Provider } from "react-redux";

import store from "../redux/store";
import "../styles/globals.scss";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  //# 리액트 쿼리 default 설정
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

  //# 토글 toast 메시지
  const [isToaster, setIsToaster] = useState<boolean>(false);

  useEffect(() => {
    setIsToaster(true);
  }, []);

  //# 이전 페이지 기억
  const storePathValues = () => {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    const prevPath = storage.getItem("currentPath");
    storage.setItem("prevPath", prevPath || "/");
    storage.setItem("currentPath", globalThis.location.pathname);
  };

  useEffect(() => storePathValues(), [router.asPath]);

  //# 스크롤 복원 비활성와
  useEffect(() => {
    if (history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <Provider store={store}>
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
          <Footer />
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
