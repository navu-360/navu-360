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
    <section className="relative flex w-full lg:justify-around justify-center items-center bg-white py-8 pt-44 text-white lg:flex-row lg:flex-wrap xl:flex-nowrap flex-col lg:gap-8 gap-16 px-6">
      <h2
        className={`textGradientTitles absolute lg:left-0 left-0 right-0 top-20 cursor-default text-3xl font-semibold ${font.className} text-center`}
      >
        Superior Features
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-in group-hover:text-secondary"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        }
        title="Create Rich Training Content"
        description="Take the guesswork out of the onboarding and training process, providing a clear roadmap."
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-in group-hover:text-secondary"
          >
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
            <path d="M12 2v2"></path>
            <path d="M12 22v-2"></path>
            <path d="m17 20.66-1-1.73"></path>
            <path d="M11 10.27 7 3.34"></path>
            <path d="m20.66 17-1.73-1"></path>
            <path d="m3.34 7 1.73 1"></path>
            <path d="M14 12h8"></path>
            <path d="M2 12h2"></path>
            <path d="m20.66 7-1.73 1"></path>
            <path d="m3.34 17 1.73-1"></path>
            <path d="m17 3.34-1 1.73"></path>
            <path d="m11 13.73-4 6.93"></path>
          </svg>
        }
        title="Exceptional Learning Experience"
        description="Support your new hires to be successful in their new role, and help them grow in their career."
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-in group-hover:text-secondary"
          >
            <path d="M15 4V2"></path>
            <path d="M15 16v-2"></path>
            <path d="M8 9h2"></path>
            <path d="M20 9h2"></path>
            <path d="M17.8 11.8 19 13"></path>
            <path d="M15 9h0"></path>
            <path d="M17.8 6.2 19 5"></path>
            <path d="m3 21 9-9"></path>
            <path d="M12.2 6.2 11 5"></path>
          </svg>
        }
        title="Track TalentProgress"
        description="We reduce the administrative workload associated with training talents"
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
      transition={{ duration: 0.5, ease: "easeIn", delay: delay * 0.1 }}
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
