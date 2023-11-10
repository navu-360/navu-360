import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";

import type { MultiValue } from "react-select";

import toaster from "utils/toaster";
import {
  useCreateProgramMutation,
  useEditProgramMutation,
  useGetOneProgramQuery,
} from "services/baseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateSectionIds,
  setDraftProgramId,
} from "redux/common/commonSlice";

import { uploadOne } from "components/common/uploader";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { DeleteConfirmModal } from "components/dashboard/confirmDeleteProgram";

import { ConfirmStep } from "components/createProgram/confirmStep";
import { CreateProgramContent } from "components/createProgram/createProgramContent";
import { ProgramDetails } from "components/createProgram/programDetails";

export default function CreateProgram() {
  const [activeTab, setActiveTab] = useState(0);

  const getDoneSteps = () => {
    switch (activeTab) {
      case 0:
        return [];
      case 1:
        return [0];
      case 2:
        return [0, 1];
      default:
        return [];
    }
  };

  const [programDetails, setProgramDetails] = useState<{
    name: string;
    description: string;
    selectedDepartments: MultiValue<unknown>;
    uploadedImage: File | string | null;
  }>();

  const dispatch = useDispatch();

  // @ts-ignore
  const draftProgramId = useSelector((state) => state.common.draftProgramId);
  const id = draftProgramId;
  const { currentData: editingProgram, refetch } = useGetOneProgramQuery(id, {
    skip: !draftProgramId,
  });

  const [saveDetails, { isLoading: creating }] = useCreateProgramMutation();
  const [editDetails, { isLoading: editing }] = useEditProgramMutation();
  const [uploading, setUploading] = useState(false);
  const saveStepOne = async () => {
    // validate
    if (!draftProgramId) {
      if (!programDetails?.name && !programDetails?.description) {
        toaster({
          status: "error",
          message: "Course name and description are required",
        });
        return;
      }
      if (!programDetails?.name) {
        toaster({
          status: "error",
          message: "Course name is required",
        });
        return;
      }
      if (!programDetails?.description) {
        toaster({
          status: "error",
          message: "Course description is required",
        });
        return;
      }
    }
    if (!programDetails?.uploadedImage) {
      toaster({
        status: "error",
        message: "Course image is required",
      });
      return;
    }
    setUploading(true);
    const res = await uploadOne(programDetails?.uploadedImage as File);
    setUploading(false);

    const body = {
      name: programDetails?.name,
      description: programDetails?.description,
      categories: programDetails?.selectedDepartments?.map(
        // @ts-ignore
        (val: unknown) => val?.value,
      ),
      imageLink:
        res?.file?.url ?? programDetails?.uploadedImage?.toString() ?? "",
    };

    await saveDetails(body)
      .unwrap()
      .then((payload) => {
        dispatch(setDraftProgramId(payload?.data?.id));
        toaster({
          status: "success",
          message: "Course draft saved!",
        });
        setActiveTab(activeTab + 1);
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  // update step if any of the program details changed: name, description, categories, image
  const updateStepOne = async () => {
    // check if any of the program details changed
    if (
      programDetails?.name === editingProgram?.data?.name &&
      programDetails?.description === editingProgram?.data?.description &&
      programDetails?.selectedDepartments
        // @ts-ignore
        ?.map((val: MultiValue<unknown>) => val?.value)
        .join(",") === editingProgram?.data?.categories.join(",") &&
      programDetails?.uploadedImage === editingProgram?.data?.image
    ) {
      // no changes
      setActiveTab(activeTab + 1);
      return;
    }

    // if uploaded image is a File, upload it
    let newLink = "";
    if (programDetails?.uploadedImage instanceof File) {
      setUploading(true);
      const res = await uploadOne(programDetails?.uploadedImage as File);
      setUploading(false);
      newLink = res?.file?.url ?? "";
    }

    const body = {
      name: programDetails?.name,
      description: programDetails?.description,
      categories: programDetails?.selectedDepartments?.map(
        // @ts-ignore
        (val: unknown) => val?.value,
      ),
      imageLink: newLink?.length > 0 ? newLink : editingProgram?.data?.image,
      id: editingProgram?.data?.id,
    };

    await editDetails(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Course details updated!",
        });
        refetch();
        setActiveTab(activeTab + 1);
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const createSectionIds = useSelector(
    // @ts-ignore
    (state) => state.common.createSectionIds,
  );

  const deleteIfCreated = async () => {
    if (draftProgramId && !edit) {
      // delete then go back
      setShowDeleteProgramModal(draftProgramId);
    } else {
      // go back
      router.back();
    }
  };

  const router = useRouter();

  const { edit } = router.query;

  useEffect(() => {
    if (edit) {
      dispatch(setDraftProgramId(edit as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  useEffect(() => {
    if (edit && editingProgram?.data?.ProgramSection) {
      dispatch(setCreateSectionIds(editingProgram?.data?.ProgramSection));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProgram?.data?.ProgramSection, edit]);

  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState("");

  const [noUnsavedChanges, setNoUnsavedChanges] = useState(true);

  return (
    <>
      <Header title="Create a new Course" />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[20px] flex h-full flex-col items-start justify-start gap-4 rounded-md p-4 md:ml-[300px] md:w-[calc(100%_-_400px)]">
          <Steps doneSteps={getDoneSteps()} activeStep={activeTab} />
          <div className="shadowAroundFeature relative h-[calc(100vh_-_160px)] w-full overflow-hidden rounded-md bg-white p-4 pb-16">
            {activeTab === 0 && (
              <ProgramDetails receiveData={setProgramDetails} />
            )}
            {activeTab === 1 && (
              <CreateProgramContent
                changesNotSaved={(val) => setNoUnsavedChanges(val)}
              />
            )}
            {activeTab === 2 && <ConfirmStep />}

            <div className="absolute inset-x-0 bottom-0 flex w-full justify-between border-t-[1px] border-t-neutral-200 bg-neutral-100 px-4 py-2">
              <button
                onClick={() => {
                  if (activeTab === 0) {
                    deleteIfCreated();
                    return;
                  }
                  setActiveTab(activeTab - 1);
                }}
                className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
              >
                {activeTab === 0 ? "Cancel" : "Back"}
              </button>
              <div className="flex gap-8">
                <button
                  onClick={() => {
                    if (activeTab === 2) {
                      router.replace(`/programs/${draftProgramId}`);
                      return;
                    }
                    if (activeTab === 0) {
                      if (!draftProgramId) {
                        saveStepOne();
                      } else {
                        updateStepOne();
                      }
                      return;
                    }
                    if (activeTab === 1) {
                      if (!noUnsavedChanges) {
                        toaster({
                          status: "error",
                          message: "Please save the chapter before continuing",
                        });
                        return;
                      }
                      if (createSectionIds?.length === 0) {
                        toaster({
                          status: "error",
                          message: "Please add at least one section",
                        });
                        return;
                      }
                    }
                    setActiveTab(activeTab + 1);
                  }}
                  disabled={creating || uploading || editing}
                  className="rounded-md bg-secondary px-8 py-1.5 text-sm font-semibold text-white"
                >
                  {activeTab === 2
                    ? draftProgramId?.length > 0
                      ? "View Course"
                      : "Create Course"
                    : "Save & Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showDeleteProgramModal?.length > 0 && (
            <DeleteConfirmModal
              id={showDeleteProgramModal as string}
              setShowConfirmModal={() => setShowDeleteProgramModal("")}
              refreshPrograms={() => {
                router.back();
              }}
            />
          )}
        </AnimatePresence>
      </DashboardWrapper>
    </>
  );
}

function Steps({
  doneSteps,
  activeStep,
}: {
  activeStep: number;
  doneSteps: number[];
}) {
  // TODO: make steps clickable
  return (
    <ol className="flex w-full items-center text-center text-sm font-medium text-gray-400 sm:text-base">
      <li
        className={`after:border-1 flex items-center font-medium tracking-tight text-secondary after:mx-6 after:hidden after:h-1 after:w-full  after:border-b sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-5 ${
          doneSteps?.includes(0)
            ? "after:border-secondary"
            : "after:border-gray-200"
        }`}
      >
        <span
          className={`flex items-center after:mx-2 after:content-['/'] sm:after:hidden ${
            doneSteps?.includes(0) ? "after:text-secondary" : ""
          } dark:after:text-gray-500`}
        >
          {doneSteps?.includes(0) ? (
            <svg
              className="mr-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          ) : (
            <div
              className={`mr-2 h-4 w-4 rounded-full ${
                activeStep === 0 ? "bg-secondary" : "bg-gray-300"
              }`}
            />
          )}
          Course <span className="hidden sm:ml-2 sm:inline-flex">Details</span>
        </span>
      </li>
      <li
        className={`after:border-1 flex items-center font-medium tracking-tight after:mx-6 after:hidden after:h-1 after:w-full after:border-b  after:content-[''] sm:after:inline-block md:w-full xl:after:mx-5 ${
          doneSteps?.includes(1)
            ? "after:border-secondary"
            : "after:border-gray-200"
        }`}
      >
        <span
          className={`flex items-center after:mx-2  after:content-['/'] sm:after:hidden ${
            doneSteps?.includes(1) || activeStep === 1
              ? "text-secondary"
              : "text-gray-500"
          }`}
        >
          {doneSteps?.includes(1) ? (
            <svg
              className="mr-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          ) : (
            <div
              className={`mr-2 h-4 w-4 rounded-full ${
                activeStep === 1 ? "bg-secondary" : "bg-gray-300"
              }`}
            />
          )}
          Course{" "}
          <span className="hidden sm:ml-2 sm:inline-flex">Materials</span>
        </span>
      </li>
      <li
        className={`flex items-center font-medium tracking-tight ${
          doneSteps?.includes(2) || activeStep === 2
            ? "text-secondary"
            : "text-gray-500"
        }`}
      >
        {doneSteps?.includes(2) ? (
          <svg
            className="mr-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        ) : (
          <div
            className={`mr-2 h-4 w-4 rounded-full ${
              activeStep === 2 ? "bg-secondary" : "bg-gray-300"
            }`}
          />
        )}
        Quiz
      </li>
    </ol>
  );
}
