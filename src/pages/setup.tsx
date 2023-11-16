import Header from "components/common/head";
import AdminCompanyDetails from "components/createOrganization/admin.step";
import LandingWrapper from "components/layout/wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { setOrgId } from "redux/auth/authSlice";
import {
  useCreateOrganizationMutation,
  useSendWelcomeEmailMutation,
  useUpdateUserMutation,
} from "services/baseApiSlice";

import toaster from "utils/toaster";

export interface CompanyDetails {
  companyName: string;
  industry: string;
  noOfEmployees: string;
}

export const getAmountFromPlan = (planName: string) => {
  switch (planName) {
    case "starter":
      return Number(process.env.NEXT_PUBLIC_PLAN_STARTER_PRICE!);
    case "regular":
      return Number(process.env.NEXT_PUBLIC_PLAN_REGULAR_PRICE!);
    case "pro":
      return Number(process.env.NEXT_PUBLIC_PLAN_PRO_PRICE!);
    default:
      return 0;
  }
};

export const getPlanNameFromAmount = (amount: number) => {
  switch (amount) {
    case Number(process.env.NEXT_PUBLIC_PLAN_STARTER_PRICE!):
      return "starter";
    case Number(process.env.NEXT_PUBLIC_PLAN_REGULAR_PRICE!):
      return "regular";
    case Number(process.env.NEXT_PUBLIC_PLAN_PRO_PRICE!):
      return "pro";
    default:
      return "free";
  }
};

export const getMaxTalentCountFromAmount = (amount: number) => {
  switch (amount) {
    case Number(process.env.NEXT_PUBLIC_PLAN_STARTER_PRICE!):
      return 15;
    case Number(process.env.NEXT_PUBLIC_PLAN_REGULAR_PRICE!):
      return 40;
    case Number(process.env.NEXT_PUBLIC_PLAN_PRO_PRICE!):
      return 200;
    default:
      return 5;
  }
};

export const getPlanIdFromName = (planName: string) => {
  switch (planName) {
    case "starter":
      return process.env.NEXT_PUBLIC_PLAN_STARTER;
    case "regular":
      return process.env.NEXT_PUBLIC_PLAN_REGULAR;
    case "pro":
      return process.env.NEXT_PUBLIC_PLAN_PRO;
    default:
      return "free";
  }
};

export default function Setup() {
  const { data: session } = useSession();

  const router = useRouter();

  const email = session?.user.email as string;

  const [sendWelcomeEmail, { isLoading: sendingEmail }] =
    useSendWelcomeEmailMutation();

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [createOrg, { isLoading: CreatingOrg }] =
    useCreateOrganizationMutation();

  const updateUserDetails = async (
    role: string,
    companyDetails: {
      companyName: string;
      industry: string;
      noOfEmployees: string;
    },
  ) => {
    await createHandler(role, companyDetails);
  };

  const dispatch = useDispatch();

  const createOrganization = async (companyDetails: {
    companyName: string;
    industry: string;
    noOfEmployees: string;
  }) => {
    // create organization
    const body = {
      name: companyDetails?.companyName,
      industry: companyDetails?.industry,
      noOfEmployees: companyDetails?.noOfEmployees,
      userId: session?.user?.id,
    };
    createOrg(body)
      .unwrap()
      .then((payload) => {
        dispatch(setOrgId(payload?.data?.id));
        sendWelcomeEmail(email).then(() => {
          toaster({
            status: "success",
            message: "Organization created and account activated!",
          });
          router.push("/dashboard");
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.message,
        });
      });
  };

  return (
    <>
      <Header title="Get Started with Navu360" />
      <LandingWrapper hideNav hideFooter>
        <AdminCompanyDetails
          goToNext={(role: string, companyDetails: CompanyDetails) =>
            updateUserDetails(role, companyDetails)
          }
          loading={isLoading || CreatingOrg || sendingEmail}
        />
      </LandingWrapper>
    </>
  );

  async function createHandler(role: string, companyDetails: CompanyDetails) {
    const body = {
      position: role,
      role: "admin",
    };

    updateUser(body)
      .unwrap()
      .then(() => {
        createOrganization(companyDetails)
          .then(() => {
            console.log();
          })
          .catch((error) => {
            toaster({
              status: "error",
              message: error.message,
            });
          });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.message,
        });
      });
  }
}
