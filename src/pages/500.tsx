import Head from "next/head";
import React from "react";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Something went wrong</title>
      </Head>
      <div className="bg-white-50 flex h-screen w-screen flex-col items-center justify-center gap-6 text-gray-200">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-gray-200">Error</h1>
          <p className="text-md font-medium">Something went wrong</p>
        </div>
        <button
          className="text-white-50 rounded-3xl bg-gray-200 px-6 py-2 font-semibold"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Go Home
        </button>
      </div>
    </>
  );
}
