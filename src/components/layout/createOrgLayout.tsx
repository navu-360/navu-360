/* eslint-disable @next/next/no-img-element */
import { GoBack } from "components/dashboard/common";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Play } from "next/font/google";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

export default function CreateOrganizationLayout({
  children,
  title,
  desc,
  goToNext,
  role,
  loading,
  companyDetails,
  fromStart,
}: {
  children: React.ReactNode;
  title: string;
  desc: string;
  goToNext: (
    role: string,
    companyDetails: {
      companyName: string;
      industry: string;
      noOfEmployees: string;
    },
  ) => void;
  files: File[];
  role: string;
  loading: boolean;
  companyDetails: {
    companyName: string;
    industry: string;
    noOfEmployees: string;
  } | null;
  fromStart?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <section className="no-scrollbar flex h-[100vh] w-screen overflow-x-hidden overflow-y-hidden">
      <div className="relative hidden h-full w-[50%] bg-dark md:block">
        <div className="spotlight absolute left-0 right-0 top-0 z-10 mx-auto h-full w-[30vw]">
          <div className="">
            <div className="spotlight-one absolute -right-32 -top-48 h-[10vw] w-[10vw] rounded-full"></div>
            <div className="spotlight-two absolute -bottom-48 -left-32 h-[10vw] w-[10vw] rounded-full"></div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-1/2 z-20 mx-auto flex w-[100%] -translate-y-1/2 flex-col gap-6 text-center">
          <h1
            className={`text-center text-3xl font-bold text-white md:text-xl xl:text-4xl ${font.className}`}
          >
            Step into the Future
            {session ? ", " + session?.user?.name.split(" ")[0] + "!" : ""}
          </h1>
          <div className="bg-gradient-to-r from-white to-white to-50% bg-clip-text text-xl font-extrabold text-transparent [text-wrap:balance]">
            Built for the modern workplace, built for{" "}
            <span className="inline-flex h-[calc(theme(fontSize.xl)*theme(lineHeight.tight))] flex-col overflow-hidden text-secondary md:h-[calc(theme(fontSize.xl)*theme(lineHeight.tight))]">
              <ul className="animate-text-slide-5 block text-left leading-tight [&_li]:block">
                <li>Employee Training</li>
                <li>Sales Training</li>
                <li>Onboarding Training</li>
                <li>Compliance Training</li>
                <li>Remote Training</li>
                <li>Partner Training</li>
              </ul>
            </span>
          </div>
        </div>
        <span className="absolute bottom-2 right-4 font-medium tracking-wider text-white">
          Need help?{" "}
          <a href="mailto:business@navu360.com" className="underline">
            Contact us
          </a>
        </span>
        <Link
          href="/"
          onClick={(e) => {
            if (
              router.pathname.includes("setup") ||
              router.pathname.includes("welcome")
            ) {
              if (session) {
                e.preventDefault();
                signOut({
                  callbackUrl: "/api/auth/logout",
                });
              } else {
              }
            }
          }}
          className="absolute top-2 z-20 flex items-center pl-4"
        >
          <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360" />
        </Link>
      </div>
      <div className="relative flex h-auto w-full flex-col p-8 pt-4 md:w-[50%] md:pt-4">
        <div className="relative">
          <GoBack customText="Cancel" />
        </div>
        <div className="mt-16 flex flex-col gap-1 text-tertiary">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-base font-medium">{desc}</p>
        </div>

        {children}
        {!fromStart && (
          <div
            className={`mt-8 flex w-full items-end justify-center px-0 md:px-8 md:pl-0 lg:justify-start`}
          >
            <button
              disabled={loading}
              onClick={() => {
                goToNext(role, companyDetails!);
              }}
              className="w-full rounded-md bg-secondary px-12 py-2 text-base font-semibold text-white md:w-[400px]"
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
