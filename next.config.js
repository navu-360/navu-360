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
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "avatars.navu360.com",
      "mdbcdn.b-cdn.net",
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
