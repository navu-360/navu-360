import type { OnboardingProgram } from "@prisma/client";
import axios from "axios";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React from "react";

export default function Program({ program }: { program: OnboardingProgram }) {
  return (
    <>
      <Header />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full flex-col items-center justify-center gap-8">
          <h1>{program.name}</h1>
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

    const paths = res.data.map((program: OnboardingProgram) => ({
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
    if (res.data) {
      return {
        props: {
          data: res.data,
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
    console.log(error);
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
