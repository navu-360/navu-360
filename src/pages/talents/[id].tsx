/* eslint-disable @next/next/no-img-element */
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React from "react";

export default function Talent() {
  return (
    <>
      <Header title={`Talent - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full items-start justify-start gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="w-full text-center text-2xl font-bold text-tertiary">
              Coming soon
            </h1>
          </div>
        </div>
      </DashboardWrapper>
    </>
  );
}
