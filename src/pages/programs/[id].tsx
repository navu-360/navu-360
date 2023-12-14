/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});
import * as Sentry from "@sentry/nextjs";

import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useState } from "react";
import { generateAvatar } from "utils/avatar";
import { useGetProgramEnrollmentsQuery } from "services/baseApiSlice";
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  ProgramSection,
  QuizQuestion,
  User,
} from "@prisma/client";
import { SmallSpinner } from "components/common/spinner";

import { motion } from "framer-motion";
import { processDate } from "utils/date";
import Link from "next/link";
import { GoBack } from "components/dashboard/common";

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

import { AnimatePresence } from "framer-motion";

import { DeleteConfirmModal } from "components/dashboard/confirmDeleteProgram";
import { useRouter } from "next/router";
import Image from "next/image";
import { GoogleDocumentViewer } from "components/createProgram/googleDocumentViewer";
import { QuestionView } from "components/createProgram/questionView";
import { CompletionStatus } from "components/dashboard/talents.table";

export interface IEnrollmentWithTalent extends OnboardingProgramTalents {
  User: User;
}

export default function Program({
  data,
}: {
  data: OnboardingProgram & {
    creator: {
      name: string;
      id: string;
    };
    QuizQuestion: QuizQuestion[];
    ProgramSection: ProgramSection[];
  };
}) {
  const router = useRouter();

  const programId = data?.id;

  // get enrolled talents
  const { data: enrolledTalents, isFetching: fetchingEnrolled } =
    useGetProgramEnrollmentsQuery(programId, {
      skip: !programId,
    });

  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState<
    boolean | string
  >(false);

  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const renderSectionType = (sectionContent: ProgramSection) => {
    switch (sectionContent.type) {
      case "block":
        return (
          <MyEditor
            isReadOnly
            getData={false}
            initialData={JSON.parse(sectionContent?.content as string)}
          />
        );
      case "document":
        return (
          <Document
            file={sectionContent?.link as string}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            onLoadError={(err) => console.log(err)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        );
      case "video":
        return (
          <video
            onContextMenu={(e) => e.preventDefault()}
            muted
            autoPlay
            controls
            loop
            className={`h-[400px] w-full rounded-lg bg-neutral-300 object-contain`}
          >
            Your browser does not support the video tag.
            <source src={sectionContent?.link as string} type="video/mp4" />
          </video>
        );
      case "link":
        return <GoogleDocumentViewer link={sectionContent?.link as string} />;

      default:
        break;
    }
  };

  return (
    <>
      <Header title={`${data?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[0px] flex h-full flex-col-reverse items-start justify-start gap-8 pt-12 md:ml-[250px] lg:flex-row">
          <GoBack />
          <div className="flex w-[95%] flex-col gap-4 lg:w-[calc(100%_-_450px)]">
            <div className="relative h-[300px] w-full rounded-xl">
              <Image
                src={data?.image as string}
                alt={data.name}
                fill
                className="rounded-xl object-cover shadow"
              />
            </div>
            <h1 className="w-full text-left text-4xl font-bold capitalize text-tertiary">
              {data?.name}
            </h1>
            {/* created by */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <img
                  src={generateAvatar(data?.creator?.name)}
                  className="h-[30px] w-[30px] rounded-full"
                  alt={data?.creator?.name}
                />
                <p className="text-[14px] font-semibold text-tertiary">
                  {data?.creator?.name}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-tertiary">
                Description
              </h3>
              <p className="text-base font-medium text-gray-500">
                {data?.description}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-tertiary">Chapters</h3>
              <div className="mb-8 flex flex-col gap-4">
                {data?.ProgramSection?.map((section: ProgramSection) => (
                  <div className="rounded-lg bg-gray-200 p-4" key={section?.id}>
                    {renderSectionType(section)}
                  </div>
                ))}
              </div>
            </div>
            {data?.QuizQuestion?.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-tertiary">
                  Questions
                </h3>
                <div className="mb-8 flex flex-col gap-4">
                  {data?.QuizQuestion?.map((question) => (
                    <QuestionView
                      {...question}
                      refetch={() => console.log("")}
                      key={question?.id}
                      fromView
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="right-8 top-28 mr-0 flex w-[95%] flex-col overflow-y-auto text-tertiary lg:fixed lg:mt-0 lg:h-[80vh] lg:w-[350px]">
            <div className="flex flex-col gap-4 rounded-xl border-[1px] border-gray-400 p-4 text-tertiary">
              <h2 className="pl-2 text-lg font-semibold text-tertiary">
                Course Details
              </h2>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-2">
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
                <div className="flex items-center gap-2 px-2">
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
                    Last updated on {processDate(data.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 pl-[2px]">
                <div className="flex items-center gap-2 px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-book-open"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <span className="text-xs font-medium">
                    Total Chapters {data?.ProgramSection?.length || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-list-checks"
                  >
                    <path d="m3 17 2 2 4-4" />
                    <path d="m3 7 2 2 4-4" />
                    <path d="M13 6h8" />
                    <path d="M13 12h8" />
                    <path d="M13 18h8" />
                  </svg>
                  <span className="text-xs font-medium">
                    Total Questions {data?.QuizQuestion?.length || 0}
                  </span>
                </div>
              </div>

              {/* created on */}

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
            <div className="flex w-full flex-col gap-0">
              {enrolledTalents?.data?.length > 0 && (
                <div className="relative mb-0 mt-8 flex items-center justify-between">
                  <h2 className="tetx-lg font-semibold">Talents enrolled</h2>
                </div>
              )}
              {/* // enrolled talents */}
              <div className="mt-0 flex flex-col gap-4 rounded-xl p-4 px-0 text-tertiary">
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
                {enrolledTalents?.data?.length === 0 && (
                  <p className="text-sm font-medium text-gray-500">
                    <Link
                      href="/talents"
                      className="font-semibold text-blue-600"
                    >
                      Enroll
                    </Link>{" "}
                    talents to this course
                  </p>
                )}

                {enrolledTalents?.data?.map(
                  (enrollment: IEnrollmentWithTalent, i: number) => (
                    <motion.div
                      initial={{ y: 15 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: i * 0.1,
                      }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      key={enrollment.id}
                      className="question-input relative mx-1 flex w-auto cursor-default items-center gap-3 rounded-lg p-4 text-tertiary"
                    >
                      <img
                        src={generateAvatar(enrollment?.User?.name as string)}
                        className="h-[50px] w-[50px] rounded-full"
                        alt={""}
                      />
                      <div className="flex w-full flex-col gap-1">
                        <p className="font-medium">{enrollment?.User?.name}</p>
                        <CompletionStatus
                          enrollment={{
                            userId: enrollment?.User?.id,
                          }}
                          fromTalentView
                        />
                      </div>
                    </motion.div>
                  ),
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
      },
    );
    const paths = res.data.data.map((program: OnboardingProgram) => ({
      params: { id: program.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    Sentry.captureException(error);
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}programs/${params.id}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
    );
    if (res.data.data) {
      return {
        props: {
          data: res.data.data,
        },
      };
    }

    return {
      props: {
        data: null,
      },
    };
  } catch (error) {
    Sentry.captureException(error);
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
