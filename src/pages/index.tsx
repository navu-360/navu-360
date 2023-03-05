import Header from "components/common/head";
import Hero from "components/landing/hero";
import LandingWrapper from "components/layout/wrapper";
import React from "react";

export default function Home() {
  return (
    <>
      <Header />
      <LandingWrapper>
        <Hero />
      </LandingWrapper>
    </>
  );
}
