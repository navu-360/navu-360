import Header from "components/common/head";
import Features from "components/landing/features";
import Hero from "components/landing/hero";
import LandingWrapper from "components/layout/wrapper";
import React from "react";

export default function Home() {
  return (
    <>
      <Header />
      <LandingWrapper>
        <Hero />
        <Features />
        <div className="inset-x-0 hidden h-max w-full flex-col items-center justify-center gap-2 bg-white py-16 text-center text-dark">
          <h4 className="flex w-max items-center gap-4 text-2xl">
            Navu360 is currently in Beta{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="6" width="20" height="8" rx="1" />
              <path d="M17 14v7" />
              <path d="M7 14v7" />
              <path d="M17 3v3" />
              <path d="M7 3v3" />
              <path d="M10 14 2.3 6.3" />
              <path d="m14 6 7.7 7.7" />
              <path d="m8 6 8 8" />
            </svg>
          </h4>
          <p className="w-max text-base leading-tight">
            We are currently in beta and would love to hear your feedback.{" "}
            <br />
            Please reach out to us at{" "}
            <a href="mailto:business@navu360.com">business@navu360.com </a>
          </p>
        </div>
      </LandingWrapper>
    </>
  );
}
