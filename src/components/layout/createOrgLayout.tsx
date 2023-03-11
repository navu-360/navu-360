/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CreateOrganizationLayout({
  children,
  title,
  desc,
  goToNext,
  files,
  role,
  loading,
  companyDetails,
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
    }
  ) => void;
  files: File[];
  role: string;
  loading: boolean;
  companyDetails: {
    companyName: string;
    industry: string;
    noOfEmployees: string;
  };
}) {
  const { data: session } = useSession();
  return (
    <section className="flex h-[100vh] w-screen">
      <div className="relative h-full w-1/3">
        <Image
          src="https://res.cloudinary.com/dpnbddror/image/upload/v1678044671/Rectangle_417_1_1_pq5jum.png"
          fill
          alt="Onboarding Image z-10"
        />
        <div className="overlay" />
        <div className="absolute inset-x-0 top-1/2 z-20 mx-auto flex w-4/5 -translate-y-1/2 flex-col gap-6  text-center">
          <h1 className="text-center text-2xl font-bold text-white">
            Welcome to Navu360, {session?.user?.name.split(" ")[0]}
          </h1>
          <p className="text-xl font-medium text-white">
            Setup your organization to experience the power of Navu360.
          </p>
        </div>
        <Link href="/" className="absolute top-2 z-20 flex items-center pl-4">
          <img src="logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
        </Link>
      </div>
      <div className="flex h-full w-2/3 flex-col p-8 pt-4">
        <div className="flex flex-col gap-1 text-tertiary">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-base font-medium">{desc}</p>
        </div>
        {children}
        <div className={`flex w-full items-end justify-end px-8`}>
          <button
            disabled={loading}
            onClick={() => {
              goToNext(role, companyDetails);
            }}
            className="rounded-md bg-secondary py-2 px-6 text-base font-semibold text-white"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </section>
  );
}
