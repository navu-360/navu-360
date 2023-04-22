/* eslint-disable @next/next/no-img-element */
import type { OutputData } from "@editorjs/editorjs";
import axios from "axios";
import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";
import type { OnboardingProgram } from "types";
import { generateAvatar } from "utils/avatar";
import {
  useGetProgramEnrollmentsQuery,
  useGetUserByIdQuery,
} from "services/baseApiSlice";
import type { OnboardingProgramTalents, User } from "@prisma/client";
import { SmallSpinner } from "components/common/spinner";

import { motion } from "framer-motion";
import { processDate } from "utils/date";
import Link from "next/link";
import { GoBack } from "components/dashboard/common";

import { AnimatePresence } from "framer-motion";

import { DeleteConfirmModal } from "components/dashboard/confirmDeleteProgram";
import { useRouter } from "next/router";

export interface IEnrollmentWithTalent extends OnboardingProgramTalents {
  User: User;
}

export default function Program({ data }: { data: OnboardingProgram }) {
  const [content, setContent] = useState<OutputData | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (data?.content) {
      const receivedContent: OutputData = JSON.parse(data.content as string);
      setContent(receivedContent);
    }
  }, [data]);

  const programId = data?.id;

  // get enrolled talents
  const { data: enrolledTalents, isFetching: fetchingEnrolled } =
    useGetProgramEnrollmentsQuery(programId, {
      skip: !programId,
    });

  const id = data?.createdBy;

  // get user
  const { data: userInfo } = useGetUserByIdQuery(id, {
    skip: !id,
  });

  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState<
    boolean | string
  >(false);

  return (
    <>
      <Header title={`${data?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full items-start justify-start gap-8 pt-16">
          <GoBack />
          <div className="flex flex-col gap-3">
            <h1 className="w-full text-left text-2xl font-bold text-tertiary">
              {data?.name}
            </h1>
            {content && <MyEditor isReadOnly initialData={content} />}
          </div>
          <div className="fixed right-4 mr-16 mt-16 flex h-[80vh] w-[20vw] min-w-[400px] flex-col overflow-y-auto text-tertiary">
            <div className="flex flex-col gap-4 rounded border-[1px] border-gray-400 p-4 text-tertiary">
              {/* created by */}
              <div className="flex items-center gap-2 px-4">
                <p className="text-xs font-medium">Created By</p>
                <div className="flex items-center gap-4">
                  {!userInfo ? (
                    <div className="flex w-[50px] scale-75 justify-center">
                      <SmallSpinner />
                    </div>
                  ) : (
                    <p className="text-[14px] font-semibold">
                      {userInfo?.data?.name}
                    </p>
                  )}
                </div>
              </div>
              {/* created on */}
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
                  Created on {processDate(data.createdAt)}
                </span>
              </div>
              {/* no of enrolled */}
              <div className="flex items-center gap-2 px-4">
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
              {/* edit, delete */}
              <div className="mt-4 flex justify-start gap-4 px-4">
                <Link
                  href={`/create/program?edit=${data.id}`}
                  className="flex w-1/2 items-center justify-center gap-2 rounded-md border-[1px] border-tertiary bg-white px-6 py-1 text-sm font-semibold text-tertiary"
                >
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>

                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => setShowDeleteProgramModal(data?.id)}
                  className="flex w-1/2 items-center justify-center gap-2 rounded-md bg-red-400 px-6 py-1 text-sm font-semibold text-white"
                >
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>

                  <span>Delete</span>
                </button>
              </div>
            </div>
            {/* list of talents */}
            <div className="flex w-full flex-col gap-4">
              {enrolledTalents?.data?.length > 0 && (
                <div className="relative mb-0 mt-8 flex items-center justify-between">
                  <h2 className="tetx-lg font-semibold">Talents enrolled</h2>
                </div>
              )}
              {/* // enrolled talents */}
              <div className="mt-2 flex flex-col gap-4 rounded border-[1px] border-gray-400 p-4 text-tertiary">
                {enrolledTalents?.data?.length === 0 && (
                  <p className="flex items-center gap-2 text-center">
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
                    No talents enrolled.
                  </p>
                )}

                {enrolledTalents?.data?.map(
                  (enrollment: IEnrollmentWithTalent, i: number) => (
                    <motion.div
                      initial={{ y: 15 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeIn",
                        delay: i * 0.1,
                      }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      key={enrollment.id}
                      className="relative flex w-full items-center gap-3 rounded-lg bg-tertiary/80 p-4 text-white"
                    >
                      <img
                        src={generateAvatar(enrollment?.User?.id)}
                        className="h-[50px] w-[50px] rounded-full bg-tertiary"
                        alt={""}
                      />
                      <div>
                        <p>{enrollment?.User?.name}</p>
                      </div>
                      <div
                        className={`absolute right-1 flex h-max items-center justify-between gap-2 rounded-lg px-4 py-2 pl-0 text-white`}
                      >
                        {enrollment?.enrollmentStatus === "completed" ? (
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
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        ) : (
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
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}

                        <p className={`text-xs font-semibold capitalize`}>
                          {enrollment?.enrollmentStatus}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
                {fetchingEnrolled && (
                  <div className="mt-3 flex w-full items-center justify-center">
                    <SmallSpinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showDeleteProgramModal && (
            <DeleteConfirmModal
              id={showDeleteProgramModal as string}
              setShowConfirmModal={() => setShowDeleteProgramModal(false)}
              refreshPrograms={() => {
                router.push("/programs");
                setShowDeleteProgramModal(false);
              }}
            />
          )}
        </AnimatePresence>
      </DashboardWrapper>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}programs/all`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    const paths = res.data.data.map((program: OnboardingProgram) => ({
      params: { id: program.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/programs/${params.id}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    if (res.data.data) {
      return {
        props: {
          data: res.data.data,
        },
        // revalidate every 24 hours
        revalidate: 60 * 60 * 24,
      };
    }

    return {
      props: {
        data: null,
      },
    };
  } catch (error) {
    console.log(error, "error");
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
