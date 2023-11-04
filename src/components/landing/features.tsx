/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";

import { Play } from "next/font/google";
import Link from "next/link";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

export default function FeaturesNavu() {
  const features = [
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1699111496/navu/app/Screenshot_from_2023-11-04_18-13-09_hmrnrg_d25473.png",
      title: "Create Courses with Ease",
      description: `Effortlessly build engaging courses with Navu360's intuitive course creator. Add text, images, videos, and documents. Say goodbye to complex course authoring tools.`,
      gradientClass: "featureThreeGradient",
      reverse: false,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1699111614/navu/app/Screenshot_from_2023-11-04_18-12-14_py0k1h_50081d.png",
      title: "Next-Gen Dashboards",
      description: `Navigate your talent development journey seamlessly with Navu360's clean and user-friendly dashboard. Monitor progress, track results, and manage courses effortlessly.`,
      gradientClass: "featureThreeGradient",
      reverse: true,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1699111904/navu/app/Screenshot_from_2023-11-04_18-10-17_b153s9_6e2a22.png",
      title: "Engage with Multimedia Learning",
      description: `Keep your team engaged with videos, quizzes, and interactive modules. Deliver effective skill development while making learning enjoyable.`,
      gradientClass: "featureThreeGradient",
      reverse: false,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1699111978/navu/app/Screenshot_from_2023-11-04_18-23-10_yeycey_5243d9.png",
      title: "Courses Library",
      description: `Streamline talent training with your library of pre-built chapters. Save time and ensure consistency in training.`,
      gradientClass: "featureThreeGradient",
      reverse: true,
    },
  ];
  return (
    <section
      id="features"
      className="relative mt-16 flex w-full flex-col pt-16 justify-center gap-8 px-6"
    >
      <h2
        className={`textGradientTitles absolute left-0 right-0 -top-0 cursor-default text-3xl font-semibold lg:left-0 ${font.className} text-center`}
      >
        Empower Your Talent Training Journey
      </h2>
      {features?.map((feature, i) => (
        <motion.div
          initial={{ y: 30, scale: 0.9 }}
          whileInView={{ y: 0, scale: 1 }}
          transition={{ ease: "easeOut", duration: 0.5, delay: i * 0.1 }}
          viewport={{ amount: 0.7, once: true }}
          key={i}
          className="group container mx-auto my-8 w-full lg:px-6"
        >
          <section className="">
            <div
              className={`shadowAroundFeature mx-auto flex h-[400px] w-full max-w-6xl flex-wrap justify-end rounded-lg lg:h-[350px] lg:w-auto ${
                feature.reverse ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-1/3 w-full shrink-0 grow-0 basis-auto md:mb-12 md:h-1/2 md:rounded-lg lg:mb-0 lg:h-full lg:w-5/12`}
              >
                <div className="relative flex h-full w-full lg:py-12">
                  <Image
                    src={feature.image}
                    className={`z-[10] w-full object-cover object-left ${
                      feature.reverse ? "md:rounded-r-lg" : "md:rounded-l-lg"
                    }`}
                    alt={feature.title}
                    fill
                  />
                </div>
              </div>
              <div
                className={`h-2/3 w-full shrink-0 grow-0 basis-auto md:h-1/2 lg:h-full lg:w-7/12`}
              >
                <div
                  className={`flex h-full items-center py-10 pr-6 text-center text-white lg:text-left ${
                    feature.gradientClass
                  } ${
                    feature.reverse
                      ? "pl-0 md:rounded-l-lg"
                      : "pl-0 md:rounded-r-lg"
                  }`}
                >
                  <div className="cursor-default pl-4 lg:pl-12">
                    <h2
                      className={`mb-6 text-xl font-bold md:text-3xl ${font.className}`}
                    >
                      {feature.title}
                    </h2>
                    <p className="mb-6 pb-2 text-sm md:text-base lg:pb-0">
                      {feature.description}
                    </p>
                    <Link
                      href="/welcome/plan"
                      className="rounded-full border-2 border-neutral-50 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-neutral-50 transition-all duration-300 ease-in hover:border-neutral-100 hover:bg-neutral-100 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 hover:px-10"
                    >
                      Explore Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      ))}
    </section>
  );
}
