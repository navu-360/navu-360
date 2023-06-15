import Head from "next/head";
import React from "react";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Something went wrong</title>
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-tertiary text-center text-gray-200">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-red-500">Error</h1>
          <p className="text-md font-medium leading-[150%]">
            Whoops, looks like our system got a little too excited. <br />{" "}
            Don&apos;t worry, we&apos;ve got our team on it!
          </p>
        </div>
        <button
          className="rounded-3xl bg-white px-12 py-2 font-semibold text-red-500"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Go Home
        </button>
        <p
          onClick={() => {
            window.location.reload();
          }}
          className="-mt-4 cursor-pointer text-xs font-semibold text-white underline"
        >
          reload?
        </p>
      </div>
    </>
  );
}
