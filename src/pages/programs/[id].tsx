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

export default function Program({ data }: { data: OnboardingProgram }) {
  const [content, setContent] = useState<OutputData | null>(null);

  useEffect(() => {
    if (data?.content) {
      const receivedContent: OutputData = JSON.parse(data.content as string);
      setContent(receivedContent);
    }
  }, [data]);

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
          <div className="fixed right-4 mt-16 mr-16 flex h-[80vh] w-[20vw] min-w-[400px] flex-col overflow-y-auto text-tertiary">
            {/* list of talents */}
            <div className="flex w-full flex-col gap-4">
              <button className="absolute right-0 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0">
                Invite talent
              </button>
              <div className="mt-8 flex items-center justify-between">
                <h2 className="tetx-lg font-semibold">Talents enrolled</h2>
              </div>

              <div className="flex w-full items-center gap-3 rounded-lg bg-tertiary/80 p-4 text-white">
                <img
                  src={generateAvatar(data?.id)}
                  className="h-[50px] w-[50px] rounded-full bg-tertiary"
                  alt={""}
                />
                <div>
                  <p>Jane Doe</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-3 rounded-lg bg-tertiary/80 p-4 text-white">
                <img
                  src={generateAvatar(data?.id)}
                  className="h-[50px] w-[50px] rounded-full bg-tertiary"
                  alt={""}
                />
                <div>
                  <p>Jane Doe</p>
                </div>
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
