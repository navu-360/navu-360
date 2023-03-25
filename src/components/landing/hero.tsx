import Image from "next/image";
import React from "react";

import { signIn, useSession } from "next-auth/react";
import { SmallSpinner } from "components/common/spinner";

export default function Hero() {
  const { status, data: session } = useSession();
  return (
    <section className="flex h-max min-h-[calc(100vh_-_65px)] w-full flex-col-reverse items-center justify-center gap-6 bg-dark px-8 pb-8 text-white md:flex-row md:justify-start md:pb-32 xl:gap-12 2xl:gap-32 2xl:px-32">
      <div className="flex min-w-max max-w-[500px] flex-col items-center gap-8 md:items-start 2xl:gap-16">
        <h1 className="text-center text-3xl font-bold md:text-left md:text-2xl xl:text-5xl 2xl:text-7xl">
          Simplify <br /> your onboarding <br /> experience.
        </h1>
        <p className="text-medium text-center text-base md:text-left xl:text-lg 2xl:text-xl">
          Onboard new talents with confidence using the <br /> ultimate
          onboarding platform
        </p>
        <button
          onClick={() => {
            signIn("google", { callbackUrl: "/" });
          }}
          disabled={status === "loading"}
          className="h-max w-max rounded-3xl bg-secondary px-12 py-3 text-center text-lg font-bold text-white hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {status === "loading" ? (
            <SmallSpinner />
          ) : (
            <span>{session?.user?.email ?? "Get started"}</span>
          )}
        </button>
      </div>
      <div className="max-w-1/2 relative mt-[50px] h-[20vw] min-h-[200px] w-[80vw] min-w-[300px] md:h-[30vw] md:min-w-[50vw]">
        <Image
          src="https://res.cloudinary.com/dpnbddror/image/upload/v1677952140/7450159_2_uweuhi.png"
          alt="Simpify your workflow"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
}
