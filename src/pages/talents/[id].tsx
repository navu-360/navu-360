/* eslint-disable @next/next/no-img-element */
import type { User } from "@prisma/client";
import axios from "axios";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React from "react";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

export default function Talent({ data }: { data: User }) {
  return (
    <>
      <Header title={`Talent - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full items-start justify-start gap-8">
          {/* sections */}
          {/* user details part - like on talent feed */}
          <section className="relative flex w-[95%] gap-8">
            <div className="absolute left-8 top-8 flex h-[350px] w-[400px] flex-col justify-between rounded-xl bg-white p-4 shadow-lg">
              <div className="w-full">
                <div className="flex gap-4">
                  <img
                    src={generateAvatar(data?.id)}
                    className="h-20 w-20 rounded-full border bg-white"
                    alt={data?.name as string}
                  />
                  <div className="flex flex-col gap-0">
                    <h1 className="text-2xl font-bold text-tertiary">
                      {data?.name}
                    </h1>
                    <div className="mt-3 flex items-center gap-1">
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
                        className="lucide lucide-mail"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      <p className="text-sm">{data?.email}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-1">
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
                        className="lucide lucide-briefcase"
                      >
                        <rect
                          width="20"
                          height="14"
                          x="2"
                          y="7"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <p className="text-sm">{data?.position}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-1">
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
                        className="lucide lucide-calendar-days"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                        <path d="M8 14h.01"></path>
                        <path d="M12 14h.01"></path>
                        <path d="M16 14h.01"></path>
                        <path d="M8 18h.01"></path>
                        <path d="M12 18h.01"></path>
                        <path d="M16 18h.01"></path>
                      </svg>
                      <p className="text-sm">
                        Enrolled {processDate(data?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hr-color h-[1px] w-full"></div>
              <div className="flex w-full flex-col gap-4">
                <button className="flex items-center justify-center gap-2 rounded-md border-[1px] border-tertiary bg-white py-2 text-base font-semibold text-tertiary">
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
                      d="M19.5 12h-15"
                    />
                  </svg>
                  <span>Remove From Program</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-md bg-red-400 py-2 text-base font-semibold text-white">
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
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Remove From Organization</span>
                </button>
              </div>
            </div>
            <div className="ml-[450px] mt-8 h-max min-h-[400px] w-full rounded-xl bg-white p-4 shadow-lg"></div>
          </section>

          {/* show their enrolled programs as cards with completion % */}
          {/* actions area - bottom - remove from program, remove from org */}
        </div>
      </DashboardWrapper>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}users/all`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    const paths = res.data.data.map((user: User) => ({
      params: { id: user.id.toString() },
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/users/${params.id}`,
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
