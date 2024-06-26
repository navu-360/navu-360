/* eslint-disable @next/next/no-img-element */
import React from "react";
import NavBar from "./landing.navbar";
import Link from "next/link";

export default function LandingWrapper({
  children,
  hideNav,
  hideFooter,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}) {
  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col gap-0 overflow-hidden bg-white ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <NavBar />}
      {children}
      {!hideFooter && <Footer />}
    </main>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-dark py-4 shadow">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <div className="flex items-center text-sm text-gray-300 sm:text-center">
          <Link href="/" className="relative flex items-center pl-4">
            <img
              src="/logo.svg"
              className="mb-1 mr-3 h-6 sm:h-9"
              alt="Navu360"
              height={36}
              width={144}
            />
          </Link>
          © {new Date().getFullYear()} . All Rights Reserved.
        </div>
        <ul className="mt-3 flex flex-wrap items-center justify-center text-sm font-medium text-gray-300 sm:mt-0">
          <li>
            <Link href="#features" className="mr-4 hover:underline md:mr-6 ">
              Features
            </Link>
          </li>
          <li>
            <Link href="#pricing" className="mr-4 hover:underline md:mr-6">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="mr-4 hover:underline md:mr-6 ">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/blog" className="mr-4 hover:underline md:mr-6 ">
              Blog
            </Link>
          </li>
          <li>
            <a
              href="mailto:business@navu360.com"
              target="_blank"
              rel="noreferrer"
              className="mr-4 hover:underline md:mr-6"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
