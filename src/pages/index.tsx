import Header from "components/common/head";
import Cta from "components/landing/cta";
import Features from "components/landing/platform";
import FeaturesNavu from "components/landing/features";
import Hero from "components/landing/hero";
import LandingWrapper from "components/layout/wrapper";
import React from "react";
import Pricing from "components/landing/pricing";

export default function Home() {
  return (
    <>
      <Header />
      <LandingWrapper>
        <Hero />
        <FeaturesNavu />
        <Features />
        <Pricing />
        <Cta />
      </LandingWrapper>
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {},
  };
}