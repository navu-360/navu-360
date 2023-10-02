import Header from "components/common/head";
import Pricing from "components/landing/pricing";
import CreateOrganizationLayout from "components/layout/createOrgLayout";
import React from "react";

export default function PickAPlan() {
  return (
    <>
      <Header title="Innovative Talent Onboarding - Navu360" />
      <CreateOrganizationLayout
        goToNext={() => null}
        files={[]}
        title="Pick a plan"
        desc="Choose a plan that best suits your organization"
        loading={false}
        role={""}
        companyDetails={null}
        fromStart
      >
        <section className="flex h-full w-full flex-col items-center">
          <Pricing fromStart />
        </section>
      </CreateOrganizationLayout>
    </>
  );
}
