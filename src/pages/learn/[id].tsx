/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React from "react";
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  ProgramSection,
  QuizQuestion,
} from "@prisma/client";
import Image from "next/image";
import ChapterStrip from "components/learnCourse/chapterStrip";

export default function ViewEnrollment({
  data,
}: {
  data: OnboardingProgramTalents & {
    OnboardingProgram: OnboardingProgram & {
      ProgramSection: ProgramSection[];
      QuizQuestion: QuizQuestion[];
    };
  };
}) {
  return (
    <>
      <Header title={`${data?.OnboardingProgram?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative mb-4 ml-[90px] mr-4 mt-[30px] flex h-full items-start justify-start gap-8 rounded-md bg-gray-100 p-4 md:ml-[250px]">
          <div className="relative flex h-full w-[80%] flex-col gap-8 px-6">
            <h1 className="text-3xl font-bold text-tertiary">
              {data?.OnboardingProgram?.name}
            </h1>
            <div className="relative h-[400px] w-full overflow-hidden">
              <Image
                className="relative z-50 h-full w-full object-contain"
                fill
                src={data?.OnboardingProgram?.image as string}
                alt={data?.OnboardingProgram?.name}
              />
              <div
                style={{
                  backgroundImage: `url(${
                    data?.OnboardingProgram?.image as string
                  })`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="absolute inset-0 z-40 h-full w-full rounded-md bg-cover bg-no-repeat blur-sm"
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-tertiary">
                Description
              </h3>
              <p className="text-base font-medium text-gray-500">
                {data?.OnboardingProgram?.description}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-tertiary">Chapters</h3>
              <div className="flex flex-col gap-2">
                {data?.OnboardingProgram?.ProgramSection?.map(
                  (section, index) => (
                    <ChapterStrip
                      key={section.id}
                      title={section?.name as string}
                      index={`0${index + 1}`}
                      done
                    />
                  ),
                )}
              </div>
            </div>
            <button className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-4 md:mr-0">
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
                className="lucide lucide-arrow-right-circle"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="m12 16 4-4-4-4" />
              </svg>
              <span>Start Course</span>
            </button>
          </div>
          <div className="fixed bottom-4 right-4 top-[95px] z-50 flex h-auto w-[20%] flex-col gap-8 rounded-br-md rounded-tr-md border-l-[1px] border-gray-300 bg-gray-100 p-4">
            <div className="flex flex-col gap-4 text-tertiary">
              <h2 className="text-base font-semibold">About the Course</h2>
            </div>
          </div>
        </div>
      </DashboardWrapper>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}enrollment/get-all`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
    );
    const paths = res.data.data.map((program: OnboardingProgramTalents) => ({
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/enrollment/one/${params.id}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
    );
    if (res?.data?.data) {
      return {
        props: {
          data: res?.data?.data,
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
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
