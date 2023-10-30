import { motion } from "framer-motion";
import type { OnboardingProgram, Organization } from "@prisma/client";

import React, { useState, useEffect } from "react";
import toaster from "utils/toaster";
import {
  useEnrollTalentMutation,
  useSendEnrolledEmailMutation,
  useGetOrganizationProgramsQuery,
} from "services/baseApiSlice";
import { useSelector } from "react-redux";
import useDebounce from "utils/useDebounce";
import { SmallSpinner } from "components/common/spinner";

export function SelectPrograms({
  talentName,
  talentId,
  closeModal,
}: {
  programs: OnboardingProgram[];
  talentName: string;
  closeModal: (val?: boolean) => void;
  talentId: string;
}) {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  const [showingItems, setShowingItems] = useState<OnboardingProgram[]>([]);

  // get programs created by this organization
  const { data: programs, isFetching } = useGetOrganizationProgramsQuery(
    orgId,
    {
      skip: !orgId,
    },
  );

  useEffect(() => {
    setShowingItems(programs?.data);
  }, [programs]);

  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);

  const [enrollTalent, { isLoading: isEnrolling }] = useEnrollTalentMutation();

  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData,
  );

  const [sendEmailAction, { isLoading }] = useSendEnrolledEmailMutation();

  const sendEmail = async (programName: string) => {
    const body = {
      programName,
      talentName: talentName.split(" ")[0],
      organizationName: organizationData?.name,
      talentId: talentId,
    };
    await sendEmailAction(body)
      .unwrap()
      .then(() => {
        console.log("email sent");
      })
      .catch(
        (error: {
          data: {
            message: string;
          };
        }) => {
          toaster({
            status: "error",
            message: error?.data?.message,
          });
        },
      );
  };

  const handleEnrollTalent = async () => {
    const body = {
      programId: selectedProgramIds,
      talentId,
      organizationId: orgId,
    };
    await enrollTalent(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Talent enrolled successfully",
        });
        console.log("selectedProgramIds", selectedProgramIds);
        // for every program, send email
        selectedProgramIds.forEach(async (programId) => {
          const programName = programs?.find(
            (program: OnboardingProgram) => program.id === programId,
          )?.name;

          if (programName) {
            await sendEmail(programName);
          }
        });

        closeModal(true);
      })
      .catch(
        (error: {
          data: {
            message: string;
          };
        }) => {
          toaster({
            status: "error",
            message: error?.data?.message,
          });
        },
      );
  };

  const [search, setSearch] = useState("");

  // @ts-ignore
  const debouncedValue: string = useDebounce(search, 500);

  const [results, setResults] = useState<OnboardingProgram[]>([]);

  useEffect(() => {
    if (results?.length > 0) {
      setShowingItems(results);
    }
  }, [results]);

  // search
  useEffect(() => {
    if (programs && debouncedValue?.length > 0) {
      const templatesFound: OnboardingProgram[] = [];
      programs.forEach((template: OnboardingProgram) => {
        if (
          template.name.toLowerCase().includes(debouncedValue.toLowerCase())
        ) {
          templatesFound.push(template);
        }
      });
      if (templatesFound.length > 0) {
        setResults(templatesFound);
      } else {
        setResults([]);
      }
    }

    if (debouncedValue.length === 0) {
      setResults([]);
    }
  }, [debouncedValue, programs]);

  return (
    <div
      onClick={(e) => (e.target === e.currentTarget ? closeModal(false) : null)}
      className="fixed inset-0 z-[130] flex h-screen w-screen items-center justify-center bg-black/50 backdrop:blur-md"
    >
      <motion.div
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="relative h-full w-full rounded-lg bg-white px-8 py-4 lg:h-max lg:w-[700px]"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-center text-xl font-semibold text-[#243669]">
              Choose programs to enroll{" "}
              <span className="font-black capitalize">{talentName}</span>
            </h1>
            <div className="flex w-full justify-between">
              <form className="">
                <input
                  type="text"
                  className="common-input max-w-[600px]"
                  placeholder="Search for programs"
                  id="search"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            </div>
            <div className="no-scrollbar flex h-max max-h-[350px] flex-col gap-4 overflow-y-auto">
              {isFetching && (
                <div className="flex items-center justify-center">
                  <SmallSpinner />
                </div>
              )}
              {showingItems?.map((program: OnboardingProgram) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between rounded-md bg-[#f5f5f5] px-4 py-3 hover:bg-secondary/25"
                >
                  <p className="cursor-default text-sm font-medium text-[#243669]">
                    {program.name}
                  </p>
                  <input
                    type="checkbox"
                    className="h-6 w-6 cursor-pointer rounded-md border-secondary text-secondary accent-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProgramIds([
                          ...selectedProgramIds,
                          program.id,
                        ]);
                      } else {
                        setSelectedProgramIds(
                          selectedProgramIds.filter((id) => id !== program.id),
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button
                disabled={
                  isEnrolling || selectedProgramIds?.length === 0 || isLoading
                }
                onClick={() => handleEnrollTalent()}
                className="ml-2 flex items-center justify-center rounded-md bg-secondary px-8 py-2 text-sm font-semibold capitalize text-white disabled:opacity-50"
              >
                {isEnrolling || isLoading
                  ? "Loading..."
                  : `Enroll ${talentName}`}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
