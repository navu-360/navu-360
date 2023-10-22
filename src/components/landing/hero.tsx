import Image from "next/image";
import React from "react";

import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="relative flex h-max min-h-[calc(100vh_-_65px)] w-full flex-col-reverse items-center justify-center gap-6 overflow-hidden bg-dark px-8 pb-8 text-white lg:flex-row lg:justify-start lg:pb-32 xl:gap-12 2xl:gap-32 2xl:px-32">
        <div className="flex cursor-default flex-col items-center gap-8 lg:min-w-max lg:max-w-[500px] lg:items-start 2xl:gap-16">
          <h1 className="text-center text-3xl font-bold lg:text-left lg:text-2xl xl:text-5xl 2xl:text-7xl !leading-[140%]">
            Streamline Talent Development <br className="hidden md:block" />{" "}
            with Navu360&apos;s LMS
          </h1>
          <p className="text-medium text-center text-base lg:text-left xl:text-lg 2xl:text-xl !leading-[150%]">
            Create, manage, and scale custom training programs effortlessly.{" "}
            <br className="hidden md:block" />
            Our LMS platform makes talent management and employee training a
            breeze!
          </p>
          <Link
            href="/welcome/plan"
            className="h-max w-max rounded-[2rem] bg-secondary px-24 py-3 text-center text-lg font-bold text-white transition-all duration-300 ease-in hover:bg-secondary hover:px-28 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Get started
          </Link>
        </div>
        <div className="max-w-1/2 relative z-10 mt-[50px] h-[20vw] min-h-[200px] w-[80vw] min-w-[300px] lg:h-[30vw] lg:min-w-[50vw]">
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
