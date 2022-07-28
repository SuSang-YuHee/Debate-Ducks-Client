import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
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
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
