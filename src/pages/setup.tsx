import Header from "components/common/head";
import AdminPersonalDetails from "components/createOrganization/admin.step1";
import AdminCompanyDetails from "components/createOrganization/admin.step2";
import LandingWrapper from "components/layout/wrapper";
import React, { useState } from "react";
import {
  useUpdateUserMutation,
  useUploadImageMutation,
} from "services/baseApiSlice";
import toast from "utils/toast";

export default function Setup() {
  const [step, setStep] = useState(1);

  const [updateUser, {isLoading, isError}] = useUpdateUserMutation();
  const [uploadImage] = useUploadImageMutation();

  const updateUserDetails = async (files: File[]) => {
    const formData = new FormData();
    formData.append("image", files[0] as Blob);

    await uploadImage(formData)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        return;
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
        return;
      });

    return;

    const body = {};
    await updateUser(body).unwrap().then((payload) => {
        toast({
          status: "success",
          message: "Profile pictured added!",
        });
        setStep(2);
      }).catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
      });
  };

  const createOrganization = async () => {
    // create organization
  };

  return (
    <>
      <Header title="Complete registration" />
      <LandingWrapper hideNav>
        {step === 1 && (
          <AdminPersonalDetails
            goToNext={(files: File[]) => updateUserDetails(files)}
            goToprev={() => setStep(1)}
          />
        )}
        {step === 2 && (
          <AdminCompanyDetails
            goToNext={() => createOrganization()}
            goToprev={() => setStep(1)}
          />
        )}
      </LandingWrapper>
    </>
  );
}
