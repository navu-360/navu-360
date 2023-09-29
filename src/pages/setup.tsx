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
      return 150000;
    case "regular":
      return 4900000;
    case "pro":
      return 9900000;
    default:
      return 150000;
  }
};

const getPlanIdFromName = (planName: string) => {
  switch (planName) {
    case "starter":
      return process.env.VERCEL_ENV === "production"
        ? "PLN_daeba4ltni1lvl7"
        : "PLN_w126x3r5g4tf9v7";
    case "regular":
      return process.env.VERCEL_ENV === "production"
        ? "PLN_ag0geiut223774g"
        : "PLN_pgsaeh34hkfbqza";
    case "pro":
      return process.env.VERCEL_ENV === "production"
        ? "PLN_rb6lnl8tcr1506h"
        : "PLN_wjdshg3on7p0ppx";
    default:
      return process.env.VERCEL_ENV === "production"
        ? "PLN_daeba4ltni1lvl7"
        : "PLN_w126x3r5g4tf9v7";
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
            "You have successfully subscribed to " +
            textToCapitalize(sub as string) +
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
        toast({
          status: "success",
          message: `Organization ${companyDetails.companyName} created!`,
        });
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
