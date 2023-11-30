import React from "react";

import { Play } from "next/font/google";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

export default function CtaCard() {
  return (
    <div className="w-full md:absolute md:bottom-12 md:left-1/2 md:w-max md:-translate-x-1/2 2xl:bottom-16">
      <h2 className={`text-center ${font.className} text-2xl font-bold`}>
        Accelerate learning, minimize resource use
      </h2>
      <div className="mt-4 grid grid-cols-1 place-content-center place-items-center items-center gap-4 md:grid-cols-3">
        <OneOffering text="Training" />
        <OneOffering text="Onboarding" />
        <OneOffering text="LMS" />
      </div>
    </div>
  );
}

function OneOffering({ text }: { text: string }) {
  return (
    <div className="btn-offering w-full">
      <span className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-sparkles mr-2 text-white"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>{" "}
        {text}
      </span>
    </div>
  );
}
