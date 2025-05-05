import { Buffer } from 'buffer';
import type { AppProps } from "next/app";
import "../styles/index.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Полифилл для Buffer
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;