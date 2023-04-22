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

export default function ViewTalent({ data }: { data: OnboardingProgram }) {
  const [content, setContent] = useState<OutputData | null>(null);

  useEffect(() => {
    if (data?.content) {
      const receivedContent: OutputData = JSON.parse(data.content as string);
      setContent(receivedContent);
    }
  }, [data]);

  // actions: mark as complete

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
      params: { programId: program.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { programId: string };
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/programs/${params.programId}`,
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
