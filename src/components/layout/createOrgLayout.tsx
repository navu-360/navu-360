/* eslint-disable @next/next/no-img-element */
import { GoBack } from "components/dashboard/common";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  return (
    <section className="no-scrollbar flex h-[100vh] w-screen overflow-y-auto overflow-x-hidden">
      <div className="relative hidden h-full w-1/3 md:block">
        <Image
          src="https://res.cloudinary.com/dpnbddror/image/upload/v1678044671/Rectangle_417_1_1_pq5jum.png"
          fill
          alt="Onboarding Image z-10"
        />
        <div className="overlay" />
        <div className="absolute inset-x-0 top-1/2 z-20 mx-auto flex w-[95%] -translate-y-1/2 flex-col gap-6  text-center">
          <h1 className="text-center text-xl font-bold text-white md:text-2xl">
            Welcome to Navu360 {session?.user?.name.split(" ")[0]}
          </h1>
          <p className="text-base font-medium text-white md:text-xl">
            Setup your organization to experience the power of Navu360.
          </p>
        </div>
        <Link href="/" className="absolute top-2 z-20 flex items-center pl-4">
          <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360" />
        </Link>
      </div>
      <div className="relative flex h-auto w-full flex-col p-8 pt-16 md:w-2/3 md:pt-4">
        <div className="flex flex-col gap-1 text-tertiary">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-base font-medium">{desc}</p>
        </div>
        <div className="block md:hidden">
          <GoBack customText="Cancel" />
        </div>

        {children}
        {!fromStart && (
          <div
            className={`mt-8 flex w-full items-end justify-center px-8 pl-0 lg:justify-start`}
          >
            <button
              disabled={loading}
              onClick={() => {
                goToNext(role, companyDetails!);
              }}
              className="rounded-md bg-secondary px-12 py-2 w-full text-base font-semibold text-white"
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
