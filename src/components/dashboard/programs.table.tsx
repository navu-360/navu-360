/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useGetProgramTalentsQuery } from "services/baseApiSlice";
import { processDate } from "utils/date";

export default function Programs({
  data,
  isFetching,
}: {
  showSelectTemplate: () => void;
  data: OnboardingProgram[];
  isFetching: boolean;
}) {
  if (data?.length === 0) return null;

  if (isFetching)
    return (
      <section className="w-full lg:w-[calc(30%_-_16px)] lg:min-w-[300px]">
        <section className="bg-blueGray-50 relative py-16 pt-0">
          <div className="mb-12 w-full px-2 pr-0">
            <div
              className="table-shadow relative mb-6 flex h-max w-full min-w-0 flex-col break-words rounded-tr-3xl bg-dark
  text-white shadow-lg"
            >
              {data?.length > 0 && (
                <div className="mb-0 rounded-t border-0 px-2 py-3 pr-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-1 flex-grow px-2 ">
                      <h3 className="text-base font-semibold text-white">
                        Recently Created Courses
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div className="no-scrollbar mt-3 flex h-max flex-col items-center gap-4 overflow-y-auto pb-8">
                {isFetching && (
                  <div className="flex w-full flex-col items-center gap-4">
                    <div className="h-[100px] w-4/5 animate-pulse rounded bg-gray-400" />
                    <div className="h-[100px] w-4/5  animate-pulse rounded bg-gray-400" />
                    <div className="h-[100px] w-4/5  animate-pulse rounded bg-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    );

  return (
    <section className="w-full lg:w-[calc(30%_-_16px)] lg:min-w-[300px]">
      <section className="bg-blueGray-50 relative">
        <div className="mb-12 w-full px-0">
          {!isFetching && data?.length > 0 && (
            <div
              className="table-shadow relative mb-6 flex h-max w-full min-w-0 flex-col break-words rounded-tr-3xl bg-dark
  text-white shadow-lg"
            >
              {data?.length > 0 && (
                <div className="mb-0 rounded-t border-0 px-2 py-3">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-1 flex-grow px-2 ">
                      <h3 className="text-base font-semibold text-white">
                        Recently Created Courses
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div className="no-scrollbar mt-3 flex h-max flex-col items-center gap-4 overflow-y-auto pb-8">
                {isFetching && (
                  <div className="flex w-full flex-col items-center gap-4">
                    <div className="h-[100px] w-4/5 animate-pulse rounded bg-gray-400" />
                    <div className="h-[100px] w-4/5  animate-pulse rounded bg-gray-400" />
                    <div className="h-[100px] w-4/5  animate-pulse rounded bg-gray-400" />
                  </div>
                )}

                {!isFetching && (
                  <div className="mx-auto flex w-[90%] flex-col gap-4">
                    {data
                      ?.slice(0, 3)
                      .map((program) => (
                        <TemplateCard key={program.id} template={program} />
                      ))}
                  </div>
                )}
                {!isFetching && data?.length > 0 && (
                  <Link
                    href={`/programs`}
                    className="mt-6 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl border border-white bg-white/5 px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-300 ease-in hover:border-secondary hover:bg-secondary hover:text-white focus:outline-none focus:ring-4 md:mr-0"
                  >
                    View All Courses
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

function TemplateCard({ template }: { template: OnboardingProgram }) {
  const programId = template?.id;

  const { data: enrolledTalents } = useGetProgramTalentsQuery(programId, {
    skip: !programId,
  });

  return (
    <Link
      href={`/programs/${template.id}`}
      className={`group relative flex w-full cursor-pointer items-center justify-between rounded-md course-card-gradient p-6 py-4 pb-4 text-white`}
    >
      <div className="flex flex-col break-all">
        <h3 className="text-base font-bold tracking-normal capitalize">{template.name}</h3>
        <p className="mt-3 flex w-full items-center gap-2 truncate text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-info mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          {template.description.length > 40 ? (
            <span>{template.description.slice(0, 40)}...</span>
          ) : (
            <span>{template.description}</span>
          )}
        </p>
        <div className="mt-2 flex items-center gap-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                clipRule="evenodd"
              />
            </svg>
            Created on {processDate(template.createdAt)}
          </p>
        </div>
        {enrolledTalents ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-users"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {enrolledTalents?.data?.length} talents enrolled
          </p>
        ) : (
          <div className="mt-1 h-[20px] w-4/5 animate-pulse rounded bg-gray-400" />
        )}
      </div>
      <div className="absolute bottom-3 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-secondary transition-all duration-300 ease-in group-hover:right-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  );
}
