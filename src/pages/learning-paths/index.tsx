/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram } from "@prisma/client";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrgLearningPathsQuery,
  useGetProgramTalentsQuery,
} from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import SearchResults from "components/common/searchResults";
import CreateLearningPath from "components/createProgram/createLearningPath/main";
import { AnimatePresence } from "framer-motion";

export default function LearningPaths() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const { data, isFetching } = useGetOrgLearningPathsQuery(undefined);

  const searchQuery = useSelector((state: any) => state.common.searchQuery);

  const [showCreateLearningPath, setShowCreateLearningPath] = useState(false);

  if (!isReady) return null;

  return (
    <>
      <Header title={`All Learning Paths`} />
      <DashboardWrapper>
        {searchQuery?.length > 0 ? (
          <SearchResults />
        ) : (
          <div className="relative ml-[80px] mt-[3rem] flex h-full flex-col items-center justify-center gap-8 pb-16 pt-20 md:ml-[250px] 2xl:ml-[250px]">
            <div className="absolute left-0 top-0 flex w-max flex-col gap-0 text-left">
              <h1 className="text-xl font-bold text-tertiary">
                Learning Paths
              </h1>
            </div>
            <button
              onClick={() => setShowCreateLearningPath(true)}
              className="absolute right-12 top-0 flex h-max min-h-[45px] w-max min-w-[120px] items-center justify-center gap-4 rounded-3xl bg-secondary px-4 py-2 text-center text-base font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-4 md:mr-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                  clipRule="evenodd"
                />
              </svg>

              <span>Create a Learning Path</span>
            </button>

            <OneLearningPath
              program={data?.data[0]}
              delay={0}
              deleteProgram={() => {}}
            />

            {data?.data?.length === 0 && (
              <div className="flex min-h-[70vh] w-full items-center justify-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#9d2a57"
                  className="h-8 w-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>You have no learning paths yet.</p>
              </div>
            )}

            {isFetching && (
              <div className="flex w-full flex-wrap justify-center gap-8 md:justify-start">
                <ProgramShimmer />
                <ProgramShimmer />
                <ProgramShimmer />
                <ProgramShimmer />
                <ProgramShimmer />
                <ProgramShimmer />
              </div>
            )}
          </div>
        )}
      </DashboardWrapper>

      <AnimatePresence>
        {showCreateLearningPath && (
          <CreateLearningPath
            closeModal={() => {
              setShowCreateLearningPath(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function OneLearningPath({
  program,
  delay,
  deleteProgram,
}: {
  program: OnboardingProgram & {
    creator: {
      name: string;
      id: string;
    };
    _count: {
      QuizQuestion: number;
      ProgramSection: number;
    };
  };
  delay: number;
  deleteProgram: (id: string) => void;
}) {
  const programId = program?.id;

  const { data: enrolledTalents } = useGetProgramTalentsQuery(programId, {
    skip: !programId,
  });

  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
      whileInView={{ y: 0 }}
      className="stat-shadow"
    >
      <Link
        href={`/programs/${program?.id ?? ""}`}
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
        className="relative flex h-[350px] w-[350px] flex-col gap-4 rounded-lg bg-white text-tertiary shadow-md"
      >
        <div className="relative flex h-[60px] w-full items-center gap-2 rounded-t-lg bg-tertiary p-4 py-10 text-white">
          <h2 className="text-lg font-bold capitalize">{program?.name}</h2>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-row-reverse items-center justify-end gap-6">
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
              router.push(`/create/program?edit=${program?.id}`);
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-book-open"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="text-xs font-medium">
              Total Chapters:{" "}
              <span className="font-semibold">
                {program?._count?.ProgramSection || 0}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-list-checks"
            >
              <path d="m3 17 2 2 4-4" />
              <path d="m3 7 2 2 4-4" />
              <path d="M13 6h8" />
              <path d="M13 12h8" />
              <path d="M13 18h8" />
            </svg>
            <span className="text-xs font-medium">
              Total Questions:{" "}
              <span className="font-semibold">
                {program?._count?.QuizQuestion || 0}
              </span>
            </span>
          </div>
        </div>
        <div className="-mt-2 flex items-center gap-2 px-4 text-xs">
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
          <p>
            Talents Enrolled:{" "}
            <span className="font-semibold">
              {enrolledTalents?.data?.length || 0}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4">
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
            Created on:{" "}
            <span className="font-semibold">
              {processDate(program?.createdAt)}
            </span>
          </span>
        </div>
        <div className="flex flex-col items-start gap-1 px-4">
          <p className="text-xs font-medium">Created By</p>
          <div className="flex items-center gap-4">
            <img
              src={generateAvatar(program?.creator?.name)}
              className="h-[30px] w-[30px] rounded-full"
              alt={program?.creator?.name}
            />
            <p className="text-[14px] font-semibold text-tertiary">
              {program?.creator?.name}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProgramShimmer() {
  return (
    <motion.div
      initial={{ y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileInView={{ y: 0 }}
      className="stat-shadow"
    >
      <div className="relative flex h-[350px] w-[350px] flex-col gap-4 rounded-lg bg-white text-tertiary shadow-md">
        <div className="relative flex h-[60px] w-full animate-pulse items-center gap-2 rounded-t-lg bg-gray-300 p-4 py-10"></div>

        <div className="absolute bottom-4 right-4 flex flex-row-reverse items-center justify-end gap-6">
          <div
            id="delete1"
            className="flex h-[35px] w-[35px] animate-pulse items-center justify-center rounded-full bg-gray-300 hover:bg-secondary/20"
          ></div>

          <div className="flex h-[35px] w-[35px] animate-pulse items-center justify-center rounded-full bg-gray-300 hover:bg-secondary/20"></div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-2 px-4">
            <div
              id="delete1"
              className="flex h-[35px] w-[35px] animate-pulse items-center justify-center rounded-full bg-gray-300 hover:bg-secondary/20"
            ></div>
            <div className="h-7 w-4/5 animate-pulse bg-gray-300 text-xs font-medium"></div>
          </div>
          <div className="flex w-full items-center gap-2 px-4">
            <div
              id="delete1"
              className="flex h-[35px] w-[35px] animate-pulse items-center justify-center rounded-full bg-gray-300 hover:bg-secondary/20"
            ></div>
            <div className="h-7 w-4/5 animate-pulse bg-gray-300 text-xs font-medium"></div>
          </div>
          <div className="flex w-full items-center gap-2 px-4">
            <div
              id="delete1"
              className="flex h-[35px] w-[35px] animate-pulse items-center justify-center rounded-full bg-gray-300 hover:bg-secondary/20"
            ></div>
            <div className="h-7 w-4/5 animate-pulse bg-gray-300 text-xs font-medium"></div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 px-4">
          <div className="h-6 w-1/2 animate-pulse bg-gray-300 text-xs font-medium"></div>
          <div className="flex w-full items-center gap-4">
            <div
              id="delete1"
              className="flex h-[50px] w-[50px] animate-pulse items-center justify-center rounded-full bg-gray-300 hover:bg-secondary/20"
            ></div>
            <div className="h-6 w-1/3 animate-pulse bg-gray-300 text-xs font-medium"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
