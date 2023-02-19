import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#cc66ff" />
          {/* og meta */}
          <meta property="og:url" content="https://navu360.com" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="https://navu360.com" />
          <meta property="twitter:url" content="https://navu360.com" />
          <meta name="twitter:creator" content="@navu360" />
          {/* pwa tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Navu360" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="Navu360" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-tap-highlight" content="no" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
