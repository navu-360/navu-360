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
  useUpdateUserMutation,
  useVerifyPaymentMutation,
} from "services/baseApiSlice";
import toast from "utils/toaster";

import { usePaystackPayment } from "react-paystack";
import type { PaystackProps } from "react-paystack/dist/types";
import toaster from "utils/toaster";

export interface CompanyDetails {
  companyName: string;
  industry: string;
  noOfEmployees: string;
}

const getAmountFromPlan = (planName: string) => {
  switch (planName) {
    case "starter":
      return Number(process.env.NEXT_PUBLIC_PLAN_STARTER_PRICE!);
    case "regular":
      return Number(process.env.NEXT_PUBLIC_PLAN_REGULAR_PRICE!);
    case "pro":
      return Number(process.env.NEXT_PUBLIC_PLAN_PRO_PRICE!);
    default:
      return Number(process.env.NEXT_PUBLIC_PLAN_STARTER_PRICE!);
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
      return "starter";
  }
};

const getPlanIdFromName = (planName: string) => {
  switch (planName) {
    case "starter":
      return process.env.NEXT_PUBLIC_PLAN_STARTER;
    case "regular":
      return process.env.NEXT_PUBLIC_PLAN_REGULAR;
    case "pro":
      return process.env.NEXT_PUBLIC_PLAN_PRO;
    default:
      return process.env.NEXT_PUBLIC_PLAN_STARTER;
  }
};

export default function Setup() {
  const { data: session } = useSession();

  const router = useRouter();
  const { sub } = router.query;

  const [verify] = useVerifyPaymentMutation();

  const verifyAction = async (reference: string) => {
    const body = {
      reference,
      email: session?.user.email as string,
    };
    await verify(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message:
            "Organization created and successfully subscribed to " +
            textToCapitalize((sub as string) ?? "Starter") +
            " plan",
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
      });
  };

  //billing
  const config: PaystackProps = {
    email: session?.user.email as string,
    amount: getAmountFromPlan(sub as string),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    plan: getPlanIdFromName(sub as string),
  };

  const textToCapitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const onSuccess = (e: { status: string; reference: string }) => {
    if (e.status === "success") {
      verifyAction(e.reference);
    }
  };

  const onClose = () => {
    console.log("");
  };

  // @ts-ignore
  const initializePayment: (
    onSuccess: (e: { status: string; reference: string }) => void,
    onClose: () => void,
  ) => void = usePaystackPayment(config);

  const subAction = async () => {
    initializePayment(onSuccess, onClose);
  };

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
    if (!role || role === "") {
      toast({
        status: "error",
        message: "Please provide your role",
      });
      return;
    }
    if (
      companyDetails.companyName === "" ||
      companyDetails.industry === "" ||
      companyDetails.noOfEmployees === ""
    ) {
      toast({
        status: "error",
        message: "Please fill all fields",
      });
      return;
    }
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
      name: companyDetails.companyName,
      industry: companyDetails.industry,
      noOfEmployees: companyDetails.noOfEmployees,
      userId: session?.user?.id,
    };
    await createOrg(body)
      .unwrap()
      .then((payload) => {
        dispatch(setOrgId(payload?.data?.id));
        subAction();
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
      });
  };

  return (
    <>
      <Header title="Innovative Talent Onboarding - Navu360" />
      <LandingWrapper hideNav>
        <AdminCompanyDetails
          goToNext={(role: string, companyDetails: CompanyDetails) =>
            updateUserDetails(role, companyDetails)
          }
          loading={isLoading || CreatingOrg}
        />
      </LandingWrapper>
    </>
  );

  async function createHandler(role: string, companyDetails: CompanyDetails) {
    const body = {
      position: role,
      role: "admin",
    };

    await updateUser(body)
      .unwrap()
      .then(() => {
        createOrganization(companyDetails)
          .then(() => {
            console.log();
          })
          .catch((error) => {
            toast({
              status: "error",
              message: error.message,
            });
          });
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
      });
  }
}
