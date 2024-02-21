/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrgLearningPathsQuery,
} from "services/baseApiSlice";
import { motion } from "framer-motion";

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
                Learning Paths: Coming Soon...
              </h1>
            </div>
            <button
              onClick={() => setShowCreateLearningPath(true)}
              className="absolute hidden right-12 top-0 h-max min-h-[45px] w-max min-w-[120px] items-center justify-center gap-4 rounded-3xl bg-secondary px-4 py-2 text-center text-base font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-4 md:mr-0"
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

            {/* <OneLearningPath
              program={data?.data[0]}
              delay={0}
              deleteProgram={() => {}}
            /> */}

            {data?.data?.length === 0 && (
              <div className="hidden min-h-[70vh] w-full items-center justify-center gap-4">
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
              <div className="hidden w-full flex-wrap justify-center gap-8 md:justify-start">
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
