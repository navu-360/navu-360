/* eslint-disable @typescript-eslint/no-var-requires */

const { withSentryConfig } = require("@sentry/nextjs");

// @ts-ignore
const runtimeCaching = require("next-pwa/cache");

// @ts-ignore
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const config = withPWA({
  reactStrictMode: true,
  sentry: {
    hideSourceMaps: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.navu360.com",
      },
      {
        protocol: "https",
        hostname: "mdbcdn.b-cdn.net",
      },
    ],
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

const sentryWebpackPluginOptions = {
  silent: true,
};

const modifiedConfig = withSentryConfig(config, sentryWebpackPluginOptions);

module.exports = modifiedConfig;
