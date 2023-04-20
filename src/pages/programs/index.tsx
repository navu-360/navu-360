/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram } from "@prisma/client";
import Header from "components/common/head";
import Spinner from "components/common/spinner";
import DashboardWrapper from "components/layout/dashboardWrapper";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrganizationProgramsQuery,
  useGetProgramTalentsQuery,
  useGetUserByIdQuery,
} from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";
import { AnimatePresence, motion } from "framer-motion";
import { DeleteConfirmModal } from "components/dashboard/confirmDelete";
import { useRouter } from "next/router";

export default function Programs() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );
  const { data, isFetching, refetch } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
    refetchOnMountOrArgChange: true,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState<
    boolean | string
  >(false);

  const [programsArray, setProgramsArray] = useState<OnboardingProgram[]>(
    data?.data
  );

  useEffect(() => {
    if (data) {
      setProgramsArray(data?.data);
    }
  }, [data]);

  if (!isReady) return null;

  if (isFetching && !data)
    return (
      <>
        <Header title="All Onboarding Programs - Loading ..." />
        <DashboardWrapper hideSearch>
          <div className="relative ml-[300px] mt-[20px] flex h-full flex-col items-center justify-center gap-8">
            <div className="flex w-full flex-wrap gap-8">
              <div className="flex min-h-[70vh] w-full items-center justify-center">
                <Spinner />
              </div>
            </div>
          </div>
        </DashboardWrapper>
      </>
    );

  return (
    <>
      <Header title={`All Onboarding Programs - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[250px] mt-[20px] flex h-full flex-col items-center justify-center gap-8 2xl:ml-[300px]">
          {programsArray?.length === 0 && (
            <div className="flex min-h-[70vh] w-full items-center justify-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#FB5881"
                className="h-8 w-8"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                  clipRule="evenodd"
                />
              </svg>
              <p>You have no programs yet.</p>
            </div>
          )}
          {programsArray?.length > 0 && (
            <div className="flex w-full flex-wrap gap-8">
              {programsArray?.map((program: OnboardingProgram, i: number) => (
                <OneProgramCard
                  key={program.id}
                  program={program}
                  delay={i * 0.05}
                  deleteProgram={(id) => setShowDeleteProgramModal(id)}
                />
              ))}
            </div>
          )}
        </div>
        <AnimatePresence>
          {showDeleteProgramModal && (
            <DeleteConfirmModal
              id={showDeleteProgramModal as string}
              setShowConfirmModal={() => setShowDeleteProgramModal(false)}
              refreshPrograms={() => {
                refetch();
                setProgramsArray((prev) =>
                  prev.filter(
                    (program) => program.id !== showDeleteProgramModal
                  )
                );
                setShowDeleteProgramModal(false);
              }}
            />
          )}
        </AnimatePresence>
      </DashboardWrapper>
    </>
  );
}

export function OneProgramCard({
  program,
  delay,
  deleteProgram,
}: {
  program: OnboardingProgram;
  delay: number;
  deleteProgram: (id: string) => void;
}) {
  const programId = program?.id;

  const { data: enrolledTalents } = useGetProgramTalentsQuery(programId);

  const id = program?.createdBy;

  const { data: userInfo, isFetching } = useGetUserByIdQuery(id, {
    skip: !id,
  });

  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 10 }}
      transition={{ duration: 0.3, ease: "easeIn", delay }}
      whileInView={{ y: 0 }}
    >
      <Link
        href={`/programs/${program.id}`}
        onClick={(e) => {
          // if click element IDs: editProgram, deleteProgram, cancel default
          if (e.target) {
            if (
              (e.target as HTMLElement).id === "delete1" ||
              (e.target as HTMLElement).id === "delete2" ||
              (e.target as HTMLElement).id === "delete3" ||
              (e.target as HTMLElement).id === "delete4" ||
              (e.target as HTMLElement).id === "delete5" ||
              (e.target as HTMLElement).id === "delete6" ||
              (e.target as HTMLElement).id === "delete7"
            ) {
              e.preventDefault();
            }
          }
        }}
        className="relative flex h-[280px] w-[300px] flex-col gap-4 rounded-lg bg-white text-tertiary shadow-md"
      >
        <div className="relative flex h-[60px] w-full items-center gap-2 rounded-t-lg bg-tertiary p-4 text-white">
          <h2 className="text-lg font-bold">{program.name}</h2>
        </div>

        {userInfo ? (
          <div className="absolute bottom-16 right-4 flex items-center gap-2">
            <p className="text-xs font-medium">Created By</p>
            <div className="flex items-center gap-4">
              <p className="text-[14px] font-semibold">
                {userInfo?.data?.name}
              </p>
              <img
                src={generateAvatar(userInfo?.data?.id)}
                className="h-[50px] w-[50px] rounded-full bg-tertiary"
                alt={userInfo?.data?.id}
              />
            </div>
          </div>
        ) : !isFetching ? null : (
          <div className="absolute bottom-16 right-4 mt-1 h-[50px] w-[90%] animate-pulse rounded bg-gray-400" />
        )}

        <div className="absolute bottom-2 right-4 flex flex-row-reverse items-center justify-end gap-6">
          <div
            id="delete1"
            onClick={() => deleteProgram(program?.id)}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full hover:bg-secondary/20"
          >
            <svg
              id="delete2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#f40101"
              className="h-7 w-7"
            >
              <path
                id="delete3"
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div
            onClick={() => {
              router.push(`/create/program?edit=${program.id}`);
            }}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full hover:bg-secondary/20"
          >
            <svg
              id="delete5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#686868"
              className="h-7 w-7"
            >
              <path
                id="delete6"
                d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"
              />
              <path
                id="delete7"
                d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"
              />
            </svg>
          </div>
        </div>

        <div className="-mt-2 flex items-center gap-2 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <p>{enrolledTalents?.data?.length || 0} talents enrolled</p>
        </div>

        <div className="mt-4 flex items-center gap-2 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium">
            Created on {processDate(program.createdAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
