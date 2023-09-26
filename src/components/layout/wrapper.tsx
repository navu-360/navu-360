/* eslint-disable @next/next/no-img-element */
import React from "react";
import NavBar from "./landing.navbar";
import Link from "next/link";

export default function LandingWrapper({
  children,
  hideNav,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
}) {
  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col gap-0 bg-white ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <NavBar />}
      {children}
      <footer className="bg-dark py-4 shadow">
        <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <div className="flex items-center text-sm text-gray-400 sm:text-center">
            <Link href="/" className="relative flex items-center pl-4">
              <img
                src="/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
            </Link>
            © 2023 . All Rights Reserved.
          </div>
          <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-400 sm:mt-0">
            <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6 ">
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6">
                About
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
    </main>
  );
}
