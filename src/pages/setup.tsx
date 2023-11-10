import Header from "components/common/head";
import AdminCompanyDetails from "components/createOrganization/admin.step";
import LandingWrapper from "components/layout/wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOrgId } from "redux/auth/authSlice";
import {
  useCreateOrganizationMutation,
  useGetUserPayStackDetailsQuery,
  useInitializeTranscationMutation,
  useSendWelcomeEmailMutation,
  useUpdateUserMutation,
  useVerifyReferenceQuery,
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
      return 10;
    case Number(process.env.NEXT_PUBLIC_PLAN_REGULAR_PRICE!):
      return 30;
    case Number(process.env.NEXT_PUBLIC_PLAN_PRO_PRICE!):
      return 200;
    default:
      return 3;
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
  const { sub, reference } = router.query;
  const { data, error, isFetching } = useVerifyReferenceQuery(
    reference as string,
    {
      skip: !reference,
    },
  );

  const [waitingForCheckout, setWaitingForCheckout] = React.useState(false);

  useEffect(() => {
    if (data) {
      proceedAfterVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      toaster({
        status: "error",
        message: "We could not verify your payment. Please try again",
      });
    }
  }, [error]);

  const email = session?.user.email as string;

  const { error: details } = useGetUserPayStackDetailsQuery(email, {
    skip: !email,
  });

  const [initializePayment] = useInitializeTranscationMutation();
  const [sendWelcomeEmail, { isLoading: sendingEmail }] =
    useSendWelcomeEmailMutation();

  const proceedAfterVerify = async () => {
    await sendWelcomeEmail(email);
    toaster({
      status: "success",
      message:
        "Organization created and successfully subscribed to " +
        textToCapitalize((sub as string) ?? "Starter") +
        " plan",
    });
    router.push("/dashboard");
  };

  const textToCapitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
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
      toaster({
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
      toaster({
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
        router.push("/dashboard");
        return;
        // @ts-ignore
        if (details?.status !== 100) {
          setWaitingForCheckout(true);
          const body = {
            sub,
          };
          initializePayment(body)
            .unwrap()
            .then((payload) => {
              window.location.href = payload?.data?.authorization_url;
              setWaitingForCheckout(false);
            })
            .catch((error) => {
              setWaitingForCheckout(false);
              toaster({
                status: "error",
                message: error.message,
              });
            });
        } else {
          router.push("/dashboard");
        }
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
          loading={
            isLoading ||
            CreatingOrg ||
            isFetching ||
            sendingEmail ||
            waitingForCheckout
          }
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
