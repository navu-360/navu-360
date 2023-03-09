/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function TopNavAdmin() {
  return (
    <header className="fixed top-0 left-[200px] z-20 flex h-[75px] w-full py-2">
      <form className="relative h-full w-[70%] rounded-md bg-blue-700/10 px-4 py-2 pr-16">
        <input
          type="text"
          name="search"
          id="search"
          required
          minLength={3}
          className="mr-4 h-full w-full rounded-md bg-white px-8 text-base font-medium tracking-tight focus:outline-none"
          placeholder="Search for programs or people ..."
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="#30475E"
          className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer"
          role="submit"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </form>
      <AdminCard />
    </header>
  );
}

function AdminCard() {
  const { data: session, status } = useSession();
  return (
    <div className="fixed top-1 right-4 flex items-center gap-2">
      <div className="relative flex h-[70px] w-[70px] items-center justify-center rounded-full bg-tertiary">
        {status === "authenticated" ? (
          <img
            src={`https://avatars.dicebear.com/api/micah/${session?.user?.id}.svg?mouth[]=laughing&mouth[]=smile&mouth[]=smirk&hair[]=dannyPhantom&hair[]=fonze`}
            className="h-[50px] w-[50px]"
            alt={session?.user?.name as string}
          />
        ) : (
          <div className="h-[50px] w-[50px] rounded-full bg-white/5" />
        )}
      </div>

      <div className="flex flex-col gap-0">
        <h2 className="text-xl font-bold text-tertiary">
          {session?.user?.name}
        </h2>
        <p className="text-md font-medium text-gray-500">
          {session?.user?.position}
        </p>
      </div>
    </div>
  );
}
