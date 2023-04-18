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
import InviteTalentsModal from "components/dashboard/inviteTalents";
import { useGetProgramTalentsQuery } from "services/baseApiSlice";
import type { OnboardingProgramTalents } from "@prisma/client";
import { SmallSpinner } from "components/common/spinner";

export default function Program({ data }: { data: OnboardingProgram }) {
  const [content, setContent] = useState<OutputData | null>(null);

  useEffect(() => {
    if (data?.content) {
      const receivedContent: OutputData = JSON.parse(data.content as string);
      setContent(receivedContent);
    }
  }, [data]);

  const programId = data?.id;

  const { data: enrolledTalents, isFetching: fetchingEnrolled } =
    useGetProgramTalentsQuery(programId);

  return (
    <>
      <Header title={`${data?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full items-start justify-start gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="w-full text-center text-2xl font-bold text-tertiary">
              {data?.name}
            </h1>
            {content && <MyEditor isReadOnly initialData={content} />}
          </div>
          <div className="fixed right-4 mr-16 mt-16 flex h-[80vh] w-[20vw] min-w-[400px] flex-col overflow-y-auto text-tertiary">
            {/* list of talents */}
            <div className="flex w-full flex-col gap-4">
              {enrolledTalents?.data?.length > 0 && (
                <div className="mt-8 flex items-center justify-between">
                  <h2 className="tetx-lg font-semibold">Talents enrolled</h2>
                </div>
              )}

              {/* // enrolled talents */}
              <div className="mt-16 flex flex-col gap-4 rounded border-[1px] border-gray-400 p-4 text-tertiary">
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
                  (talent: OnboardingProgramTalents) => (
                    <div
                      key={talent.id}
                      className="flex w-full items-center gap-3 rounded-lg bg-tertiary/80 p-4 text-white"
                    >
                      <img
                        src={generateAvatar(talent?.id)}
                        className="h-[50px] w-[50px] rounded-full bg-tertiary"
                        alt={""}
                      />
                      <div>
                        <p>{talent?.name}</p>
                      </div>
                    </div>
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
