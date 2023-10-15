import Header from "components/common/head";
import Pricing from "components/landing/pricing";
import CreateOrganizationLayout from "components/layout/createOrgLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function PickAPlan() {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (session?.user?.role === "talent") {
        router.replace("/learn");
        return;
      }
      if (session?.user?.hasBeenOnboarded) {
        router.push("/dashboard");
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
