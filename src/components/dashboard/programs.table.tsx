/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram } from "@prisma/client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrganizationProgramsQuery,
  useGetProgramTalentsQuery,
} from "services/baseApiSlice";

export default function Programs({
  showSelectTemplate,
  countOfPrograms,
  setPrograms,
}: {
  showSelectTemplate: () => void;
  countOfPrograms: (count: number) => void;
  setPrograms: (programs: OnboardingProgram[]) => void;
}) {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  // get programs created by this organization
  const { data, isFetching } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
  });

  useEffect(() => {
    countOfPrograms(data?.data?.length || 0);
    setPrograms(data?.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data?.length]);

  if (isFetching)
    return (
      <section className="w-[25%] min-w-[300px]">
        <section className="bg-blueGray-50 relative py-16">
          <div className="mb-12 w-full px-2 pr-0">
            <div
              className="table-shadow relative mb-6 flex h-max w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
            >
              {data?.data?.length > 0 && (
                <div className="mb-0 rounded-t border-0 px-2 py-3 pr-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-1 flex-grow px-2 ">
                      <h3 className="text-base font-semibold text-white">
                        Recently created programs
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div className="no-scrollbar mt-3 flex h-max flex-col items-center gap-4 overflow-y-auto pb-8">
                {(isFetching || !orgId) && (
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
    <section className="w-[25%] min-w-[300px]">
      <section className="bg-blueGray-50 relative">
        <div className="mb-12 w-full px-0">
          <div
            className="table-shadow relative mb-6 flex h-max w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
          >
            {data?.data?.length > 0 && (
              <div className="mb-0 rounded-t border-0 px-2 py-3">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-1 flex-grow px-2 ">
                    <h3 className="text-base font-semibold text-white">
                      Recently created programs
                    </h3>
                  </div>
                </div>
              </div>
            )}
            <div className="no-scrollbar mt-3 flex h-max flex-col items-center gap-4 overflow-y-auto pb-8">
              {(isFetching || !orgId) && (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="h-[100px] w-4/5 animate-pulse rounded bg-gray-400" />
                  <div className="h-[100px] w-4/5  animate-pulse rounded bg-gray-400" />
                  <div className="h-[100px] w-4/5  animate-pulse rounded bg-gray-400" />
                </div>
              )}
              {!isFetching && orgId && data?.data?.length === 0 && (
                <div className="relative flex flex-col items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    No Programs Found
                  </h3>
                  <button
                    onClick={() => showSelectTemplate()}
                    className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-[#fc7e9e] focus:outline-none focus:ring-4 md:mr-0"
                  >
                    Create Program
                  </button>
                </div>
              )}
              {!isFetching && (
                <div className="mx-auto flex w-[90%] flex-col gap-4">
                  {data?.data
                    ?.slice(0, 3)
                    .map(
                      (program: {
                        name: string;
                        id: string;
                        content: string;
                      }) => (
                        <TemplateCard key={program.id} template={program} />
                      )
                    )}
                </div>
              )}
              {!isFetching && data?.data?.length > 0 && (
                <Link
                  href={`/programs`}
                  className="mt-6 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl border border-secondary bg-tertiary px-8 py-2 text-center text-lg font-semibold text-secondary transition-all duration-300 ease-in hover:bg-secondary hover:text-white focus:outline-none focus:ring-4 md:mr-0"
                >
                  View All Programs
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function TemplateCard({
  template,
}: {
  template: {
    id: string;
    name: string;
  };
}) {
  const programId = template?.id;

  const { data: enrolledTalents } = useGetProgramTalentsQuery(programId, {
    skip: !programId,
  });

  return (
    <Link
      href={`/programs/${template.id}`}
      className={`group relative flex w-full cursor-pointer items-center justify-between rounded-md bg-[#28293E] p-6 py-2 text-white`}
    >
      <div className="flex flex-col break-all">
        <h3 className="text-sm font-bold">{template.name}</h3>
        {enrolledTalents ? (
          <p className="mt-1 text-sm font-medium ">
            {enrolledTalents?.data?.length} talents enrolled
          </p>
        ) : (
          <div className="mt-1 h-[20px] w-4/5 animate-pulse rounded bg-gray-400" />
        )}
      </div>
      <div className="absolute bottom-2 right-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-secondary transition-all duration-300 ease-in group-hover:right-1">
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
