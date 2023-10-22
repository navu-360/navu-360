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
        "https://res.cloudinary.com/dpnbddror/image/upload/v1695740221/navu/6131317852b1cc37a92ece7d_Challenges_to_workplace_diversity_mkyerw.jpg",
      title: "Custom-Tailored Onboarding",
      description: `Ensure every new hire feels uniquely welcomed. Our platform allows you to craft distinct onboarding experiences, tuned to individual preferences and roles.`,
      gradientClass: "featureThreeGradient",
      reverse: false,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1695740268/navu/Interactive-Training-Tools_vqcbqb.jpg",
      title: "Engaging Multimedia Learning",
      description: `Turn training sessions into captivating experiences. With Navu360, employees aren't just passive listeners; they're active participants.`,
      gradientClass: "featureThreeGradient",
      reverse: true,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1695740316/navu/1679913952058_bdst6u.jpg",
      title: "Insightful Engagement Metrics",
      description: `It's not just about training; it's about understanding its impact. With our advanced analytics, you can delve deep into how engaged your employees truly are.`,
      gradientClass: "featureThreeGradient",
      reverse: false,
    },
  ];
  return (
    <section id="features" className="mt-16 flex w-full justify-center flex-col gap-8 px-6">
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
              className={`shadowAroundFeature mx-auto flex lg:h-[350px] h-[650px] lg:w-auto w-full max-w-6xl flex-wrap justify-end rounded-lg ${
                feature.reverse ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`mb-12 lg:h-full h-1/2 w-full shrink-0 grow-0 basis-auto rounded-lg lg:mb-0 lg:w-5/12`}
              >
                <div className="relative flex h-full w-full lg:py-12">
                  <Image
                    src={feature.image}
                    className={`z-[10] w-full object-cover ${
                      feature.reverse ? "rounded-r-lg" : "rounded-l-lg"
                    }`}
                    alt={feature.title}
                    fill
                  />
                </div>
              </div>
              <div className={`w-full shrink-0 grow-0 basis-auto lg:h-full h-1/2 lg:w-7/12`}>
                <div
                  className={`flex h-full items-center py-10 pr-6 text-center text-white lg:text-left ${
                    feature.gradientClass
                  } ${
                    feature.reverse ? "rounded-l-lg pl-0" : "rounded-r-lg pl-0"
                  }`}
                >
                  <div className="cursor-default lg:pl-12 pl-4">
                    <h2 className={`mb-6 md:text-3xl text-xl font-bold ${font.className}`}>
                      {feature.title}
                    </h2>
                    <p className="mb-6 pb-2 lg:pb-0 md:text-base text-sm">{feature.description}</p>
                    <Link
                      href="/welcome/plan"
                      className="rounded-full border-2 border-neutral-50 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-neutral-50 transition-all duration-300 ease-in hover:border-neutral-100 hover:bg-neutral-100 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 group-hover:px-10"
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
