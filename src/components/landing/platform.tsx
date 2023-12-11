import React from "react";

import { motion } from "framer-motion";
import { Play } from "next/font/google";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

export default function Features() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-16 bg-white px-6 py-8 pt-44 text-white lg:flex-row lg:flex-wrap lg:justify-around lg:gap-8 xl:flex-nowrap">
      <h2
        className={`textGradientTitles absolute left-0 right-0 top-20 cursor-default px-4 text-3xl font-semibold lg:left-0 ${font.className} text-center`}
      >
        Navu360: Where Training Gets a Modern Makeover
      </h2>
      <OneFeature
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="transition-all duration-300 ease-in group-hover:text-secondary"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        }
        title="Elevate Your Talent Training"
        description="Say goodbye to dull slides and outdated training methods. Empowers your team!"
        delay={0}
      />
      <OneFeature
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="transition-all duration-300 ease-in group-hover:text-secondary"
          >
            <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M17 18h1" />
            <path d="M12 18h1" />
            <path d="M7 18h1" />
          </svg>
        }
        title="Streamline Learning Management"
        description="Save time and provide personalized learning experiences by tracking progress real-time and more!"
        delay={1}
      />
      <OneFeature
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="transition-all duration-300 ease-in group-hover:text-secondary"
          >
            <path d="M12 22v-7l-2-2" />
            <path d="M17 8v.8A6 6 0 0 1 13.8 20v0H10v0A6.5 6.5 0 0 1 7 8h0a5 5 0 0 1 10 0Z" />
            <path d="m14 14-2 2" />
          </svg>
        }
        title="Transform Training into Results"
        description="Turn your training into a strategic advantage. Unlock your team's full potential!"
        delay={2}
      />
    </section>
  );
}

function OneFeature({
  svg,
  title,
  description,
  delay,
}: {
  svg: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: delay * 0.1 }}
      viewport={{ amount: 1, once: true }}
      className="shadowAroundFeature group flex max-w-[450px] cursor-default flex-col items-center gap-4 rounded-xl bg-white px-8 py-4 text-center text-tertiary"
    >
      {svg}{" "}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold transition-all duration-300 ease-in group-hover:text-secondary">
          {title}
        </h3>
        <p className="leading-[150%]">{description}</p>
      </div>
    </motion.div>
  );
}
