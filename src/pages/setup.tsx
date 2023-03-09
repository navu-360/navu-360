import Header from "components/common/head";
import { uploadAllToCloudinary } from "components/common/uploader";
import AdminPersonalDetails from "components/createOrganization/admin.step1";
import AdminCompanyDetails from "components/createOrganization/admin.step2";
import LandingWrapper from "components/layout/wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  useCreateOrganizationMutation,
  useUpdateUserMutation,
} from "services/baseApiSlice";
import toast from "utils/toast";

export interface CompanyDetails {
  companyName: string;
  industry: string;
  noOfEmployees: string;
}

export default function Setup() {
  const [step, setStep] = useState(1);

  const { data: session } = useSession();

  const router = useRouter();

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [createOrg, { isLoading: CreatingOrg }] =
    useCreateOrganizationMutation();

  const updateUserDetails = async (files: File[], role: string) => {
    console.log("files", files);
    let image = "";
    let publicId = "";
    if (File.length > 0 && files[0] instanceof File) {
      // @ts-ignore
      uploadAllToCloudinary(files).then(async function (
        results: { public_id: string; url: string }[]
      ) {
        if (results.length > 0 && results[0]) {
          image = results && results[0]?.url;
          publicId = results && results[0]?.public_id;
        }
        await createHandler(image, publicId, role);
      });
    } else {
      await createHandler(image, publicId, role);
    }
  };

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
      .then(() => {
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
        {step === 1 && (
          <AdminPersonalDetails
            goToNext={(files: File[], role: string) =>
              updateUserDetails(files, role)
            }
            goToprev={() => setStep(1)}
            loading={isLoading || CreatingOrg}
          />
        )}
        {step === 2 && (
          <AdminCompanyDetails
            goToNext={(
              files: File[],
              role: string,
              companyDetails: CompanyDetails
            ) => createOrganization(companyDetails)}
            goToprev={() => setStep(1)}
            loading={isLoading || CreatingOrg}
          />
        )}
      </LandingWrapper>
    </>
  );

  async function createHandler(image: string, publicId: string, role: string) {
    const body = {
      image: image,
      publicId: publicId,
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
        setStep(2);
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
      });
  }
}
