import React from "react";
import { signIn } from "next-auth/react";

export default function Cta() {
  return (
    <div className="mt-24 w-full">
      <section className="mb-0">
        <div className="relative h-[500px] overflow-hidden bg-[url('https://mdbcdn.b-cdn.net/img/new/slides/006.webp')] bg-cover bg-[50%] bg-no-repeat">
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,0%,0.75)] bg-fixed">
            <div className="flex h-full items-center justify-center">
              <div className="px-6 text-center text-white md:px-12">
                <h2 className="mb-12 text-5xl font-bold leading-tight tracking-tight">
                  Are you ready <br />
                  <span>elevate your team?</span>
                </h2>
                <button
                  onClick={() => {
                    signIn("google", { callbackUrl: "/" });
                  }}
                  className="rounded-3xl border-2 border-neutral-50 px-[46px] pb-[12px] pt-[14px] text-sm font-semibold uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-100 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
