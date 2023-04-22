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
import { useMarkEnrollmentCompletedMutation } from "services/baseApiSlice";
import toaster from "utils/toaster";
import type { OnboardingProgramTalents } from "@prisma/client";
import { GoBack } from "components/dashboard/common";

export default function ViewTalent({
  data,
}: {
  data: OnboardingProgramTalents & {
    OnboardingProgram: OnboardingProgram;
  };
}) {
  const [content, setContent] = useState<OutputData | null>(null);

  useEffect(() => {
    if (data?.OnboardingProgram?.content) {
      const receivedContent: OutputData = JSON.parse(
        data?.OnboardingProgram?.content as string
      );
      setContent(receivedContent);
    }
  }, [data]);

  // actions: mark as complete
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsCompleted(data?.enrollmentStatus === "completed");
  }, [data]);

  const [markAsComplete, { isLoading }] = useMarkEnrollmentCompletedMutation();

  const actionHandler = async () => {
    if (isCompleted) return;

    const body = {
      enrollmentId: data?.id,
    };
    await markAsComplete(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Program marked as completed!",
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  return (
    <>
      <Header title={`${data?.OnboardingProgram?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full items-start justify-start gap-8 pt-16">
          <GoBack />
          <div className="flex w-[95%] min-w-[95%] flex-col gap-3 pb-8">
            <h1 className="w-full text-left text-2xl font-bold text-tertiary">
              {data?.OnboardingProgram?.name}
            </h1>
            {content && <MyEditor isReadOnly initialData={content} />}
            {data?.OnboardingProgram && (
              <button
                onClick={() => {
                  setIsCompleted(true);
                  actionHandler();
                }}
                disabled={isCompleted || isLoading}
                className="mx-auto flex w-[300px] cursor-pointer items-center justify-center gap-4 rounded-lg bg-gray-100 px-6 py-2 font-bold text-tertiary"
              >
                {!isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00b300"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-check-circle-2"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                )}
                <span
                  className={`${
                    isCompleted ? "text-[#00b300]" : "text-tertiary"
                  }`}
                >
                  {isCompleted ? "Completed" : "Mark as complete"}
                </span>
              </button>
            )}
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
      }
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
      }
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
    console.log(error, "error");
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
