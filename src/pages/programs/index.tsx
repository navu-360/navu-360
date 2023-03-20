/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram } from "@prisma/client";
import Header from "components/common/head";
import Spinner from "components/common/spinner";
import DashboardWrapper from "components/layout/dashboardWrapper";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useGetOrganizationProgramsQuery } from "services/baseApiSlice";
import { processDate } from "utils/date";

export default function Programs() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );
  const { data, isFetching } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
    refetchOnMountOrArgChange: true,
  });

  if (isFetching)
    return (
      <>
        <Header title="All Onboarding Programs - Loading ..." />
        <DashboardWrapper hideSearch>
          <div className="relative ml-[300px] mt-[20px] flex h-full flex-col items-center justify-center gap-8">
            <div className="flex w-full flex-wrap gap-8">
              <div className="flex min-h-[70vh] w-full items-center justify-center">
                <Spinner />
              </div>
            </div>
          </div>
        </DashboardWrapper>
      </>
    );

  return (
    <>
      <Header title={`All Onboarding Programs - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[250px] mt-[20px] flex h-full flex-col items-center justify-center gap-8 2xl:ml-[300px]">
          {data?.data?.length === 0 && (
            <div className="flex min-h-[70vh] w-full items-center justify-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#FB5881"
                className="h-8 w-8"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                  clipRule="evenodd"
                />
              </svg>
              <p>You have no programs yet.</p>
            </div>
          )}
          {data?.data?.length > 0 && (
            <div className="flex w-full flex-wrap gap-8">
              {data?.data?.map((program: OnboardingProgram) => (
                <OneProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </DashboardWrapper>
    </>
  );
}

export function OneProgramCard({ program }: { program: OnboardingProgram }) {
  return (
    <Link
      href={`/programs/${program.id}`}
      className="relative flex h-[280px] w-[300px] flex-col gap-4 rounded-lg bg-white text-tertiary shadow-md"
    >
      <div className="flex h-[60px] w-full items-center gap-2 rounded-t-lg bg-tertiary p-4 text-white">
        <h2 className="break-all text-lg font-bold">{program.name}</h2>
      </div>

      <div className="absolute right-2 bottom-2 flex items-center gap-2">
        <p className="text-xs font-medium">Created By</p>
        <div className="flex items-center gap-4">
          <p className="text-[14px] font-semibold">User Name</p>
          <img
            src={`https://avatars.dicebear.com/api/micah/${program?.id}.svg?mouth[]=laughing&mouth[]=smile&mouth[]=smirk&hair[]=dannyPhantom&hair[]=fonze`}
            className="h-[50px] w-[50px] rounded-full bg-tertiary"
            alt={program?.name}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 px-4">
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
        <p>6 talents invited</p>
      </div>

      <div className="flex items-center gap-2 px-4">
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
          Created on {processDate(program.createdAt)}
        </span>
      </div>
    </Link>
  );
}
