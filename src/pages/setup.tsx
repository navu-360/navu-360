import Header from "components/common/head";
import AdminPersonalDetails from "components/createOrganization/admin.step1";
import AdminCompanyDetails from "components/createOrganization/admin.step2";
import LandingWrapper from "components/layout/wrapper";
import React, { useState } from "react";

export default function Setup() {
  const [step, setStep] = useState(1);
  return (
    <>
      <Header title="Complete registration" />
      <LandingWrapper hideNav>
        {step === 1 && (
          <AdminPersonalDetails
            goToNext={() => setStep(2)}
            goToprev={() => setStep(1)}
          />
        )}
        {step === 2 && (
          <AdminCompanyDetails
            goToNext={() => setStep(2)}
            goToprev={() => setStep(1)}
          />
        )}
      </LandingWrapper>
    </>
  );
}
