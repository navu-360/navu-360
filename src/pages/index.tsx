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
      </LandingWrapper>
    </>
  );
}
