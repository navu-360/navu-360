import Image from "next/image";
import React from "react";

import { signIn, useSession } from "next-auth/react";
import { SmallSpinner } from "components/common/spinner";

export default function Hero() {
  const { status, data: session } = useSession();

  return (
    <>
      <section className="relative flex h-max min-h-[calc(100vh_-_65px)] w-full flex-col-reverse items-center justify-center gap-6 overflow-hidden bg-dark px-8 pb-8 text-white md:flex-row md:justify-start md:pb-32 xl:gap-12 2xl:gap-32 2xl:px-32">
        <div className="flex flex-col items-center gap-8 md:min-w-max md:max-w-[500px] md:items-start 2xl:gap-16">
          <h1 className="text-center text-3xl font-bold md:text-left md:text-2xl xl:text-5xl 2xl:text-7xl">
            Talent Training <br className="hidden md:block" />& Onboarding
          </h1>
          <p className="text-medium text-center text-base md:text-left xl:text-lg 2xl:text-xl">
            Unlock the full potential of your talent with navu360&apos;s
            innovative platform, <br className="hidden md:block" />{" "}
            revolutionizing training and development
          </p>
          <button
            onClick={() => {
              signIn("google", { callbackUrl: "/" });
            }}
            disabled={status === "loading"}
            className="h-max w-max rounded-[2rem] bg-secondary px-24 py-3 text-center text-lg font-bold text-white hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {status === "loading" ? (
              <SmallSpinner />
            ) : (
              <span>{session?.user?.email ?? "Get started"}</span>
            )}
          </button>
        </div>
        <div className="max-w-1/2 relative z-10 mt-[50px] h-[20vw] min-h-[200px] w-[80vw] min-w-[300px] md:h-[30vw] md:min-w-[50vw]">
          <Image
            src="https://res.cloudinary.com/dpnbddror/image/upload/v1677952140/7450159_2_uweuhi.png"
            alt="Simpify your workflow"
            fill
            className="z-20 object-contain"
          />
          <div className="spotlight absolute left-0 right-0 top-0 z-10 mx-auto h-[30vw] w-[30vw]">
            <div className="">
              <div className="spotlight-one absolute right-0 top-0 h-[10vw] w-[10vw] rounded-full"></div>
              <div className="spotlight-two absolute bottom-0 left-0 h-[10vw] w-[10vw] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
