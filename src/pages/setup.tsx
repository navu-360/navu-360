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
} from "services/baseApiSlice";
import toast from "utils/toaster";

export interface CompanyDetails {
  companyName: string;
  industry: string;
  noOfEmployees: string;
}

export default function Setup() {
  const { data: session } = useSession();

  const router = useRouter();

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [createOrg, { isLoading: CreatingOrg }] =
    useCreateOrganizationMutation();

  const updateUserDetails = async (
    role: string,
    companyDetails: {
      companyName: string;
      industry: string;
      noOfEmployees: string;
    }
  ) => {
    await createHandler(role);
    await createOrganization(companyDetails);
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
          message: `Organizaion ${companyDetails.companyName} created!`,
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

  return (
    <>
      <Header title="Complete registration" />
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

  async function createHandler(role: string) {
    const body = {
      position: role,
    };

    await updateUser(body)
      .unwrap()
      .then(() => {
        toast({
          status: "success",
          message: `Hi ${
            session?.user?.name.split(" ")[0]
          }, your details have been updated`,
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
