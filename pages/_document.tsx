import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.png" />
          <meta name="description" content="Диктант Победы 2025" />
          <meta property="og:site_name" content="victory-dict.vercel.app" />
          <meta property="og:description" content="Диктант Победы 2025" />
          <meta property="og:title" content="Диктант Победы 2025" />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
