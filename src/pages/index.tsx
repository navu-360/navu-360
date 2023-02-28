import Header from "components/common/head";
import LandingWrapper from "components/layout/wrapper";
import React, { useState } from "react";
import { useJoinWaitlistMutation } from "services/baseApiSlice";
import toast from "utils/toast";

export default function Home() {
  return (
    <>
      <Header />
      <LandingWrapper>
        <section className="px-4">
          <h1>Welcome Home</h1>
        </section>
      </LandingWrapper>
    </>
  );
}
