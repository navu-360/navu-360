import Header from "components/common/head";
import React from "react";

export default function Custom404() {
  return (
    <>
      <Header title="Page not found - Navu360" />
      <main className="flex h-screen w-full flex-col items-center justify-center bg-white text-[#1A2238]">
        <h1 className="text-9xl font-extrabold tracking-widest text-[#1A2238]">
          404
        </h1>
        <div className="absolute rotate-12 rounded bg-secondary px-2 text-sm text-white">
          Page Not Found
        </div>
        <button className="mt-5">
          <a className="group relative inline-block text-sm font-medium text-[#fff] focus:outline-none focus:ring active:text-[#fff]">
            <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-secondary transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

            <span className="relative block border border-current bg-[#1A2238] px-12 py-3 font-bold">
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Go Home
              </button>
            </span>
          </a>
        </button>
      </main>
    </>
  );
}
