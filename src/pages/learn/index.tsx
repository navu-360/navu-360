import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  ProgramSection,
  User,
} from "@prisma/client";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrgId, setOrganizationData } from "redux/auth/authSlice";
import {
  useGetOrganizationByIdQuery,
  useGetTalentEnrollmentsQuery,
} from "services/baseApiSlice";

export default function LearnCenter() {
  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
  );

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  const id = orgId;
  // get organization data
  const { data: organizationData } = useGetOrganizationByIdQuery(id, {
    skip: !id,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (organizationData) {
      dispatch(setOrgId(organizationData?.organization?.id));
      dispatch(setOrganizationData(organizationData?.organization));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationData]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // get all enrolled programs
  const talentId = userProfile?.id;
  const { data } = useGetTalentEnrollmentsQuery(talentId, {
    skip: !talentId,
  });

  const [activeTab, setActiveTab] = useState("all");

  if (!isReady) return null;

  return (
    <>
      <Header
        title={`${organizationData?.organization?.name ?? ""} Learn Center`}
      />
      <DashboardWrapper>
        <div className="relative ml-[90px] mt-[1rem] pr-4 pt-8 text-tertiary md:ml-[250px]">
          <h1 className="w-full text-2xl font-bold capitalize">My Courses</h1>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex w-max flex-col items-center justify-center gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`text-base tracking-wider ${
                  activeTab === "all"
                    ? "font-bold text-tertiary"
                    : "font-semibold text-gray-400"
                }`}
              >
                All
              </button>
            </div>
            <div className="flex w-max flex-col items-center justify-center gap-1">
              <button
                onClick={() => setActiveTab("active")}
                className={`text-base tracking-wider ${
                  activeTab === "active"
                    ? "font-bold text-tertiary"
                    : "font-semibold text-gray-400"
                }`}
              >
                Active
              </button>
            </div>
            <div className="flex w-max flex-col items-center justify-center gap-1">
              <button
                onClick={() => setActiveTab("completed")}
                className={`text-base tracking-wider ${
                  activeTab === "completed"
                    ? "font-bold text-tertiary"
                    : "font-semibold text-gray-400"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
          <div className="mt-4 grid w-full grid-cols-5 gap-4">
            {data?.data?.map(
              (
                program: OnboardingProgramTalents & {
                  OnboardingProgram: OnboardingProgram & {
                    ProgramSection: ProgramSection[];
                  };
                },
              ) => (
                <OneCourse
                  image={program.OnboardingProgram.image as string}
                  key={program.OnboardingProgram.id}
                  title={program.OnboardingProgram.name}
                  numofChapters={
                    program.OnboardingProgram.ProgramSection?.length ?? 0
                  }
                  completedChapters={0}
                  id={program.id}
                />
              ),
            )}
            {!data && (
              <>
                <CourseShimmer />
                <CourseShimmer />
                <CourseShimmer />
                <CourseShimmer />
                <CourseShimmer />
              </>
            )}
          </div>
        </div>
      </DashboardWrapper>
    </>
  );
}

function OneCourse({
  image,
  title,
  numofChapters,
  completedChapters,
  id,
}: {
  image: string;
  title: string;
  numofChapters: number;
  completedChapters: number;
  id: string;
}) {
  return (
    <Link
      href={`/learn/${id}`}
      className="question-input group relative h-[300px] w-full justify-between rounded-xl bg-white"
    >
      <div className="relative h-[60%] w-full">
        <Image
          className="h-full w-full rounded-t-xl object-cover"
          src={image}
          fill
          alt="Course"
        />
      </div>

      {/* <div className="overlay-course" /> */}
      <div className="flex h-[40%] flex-col justify-between gap-4 px-4 py-4 text-tertiary">
        <h2 className="w-[80%] text-base font-bold text-tertiary">
          {title?.length > 40 ? title?.slice(0, 40) + "..." : title}
        </h2>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">
            {completedChapters}/{numofChapters}
          </span>
          <div className="flex w-full gap-2">
            {[...Array(numofChapters)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-[25%] rounded-3xl ${
                  i < completedChapters ? "bg-secondary" : "bg-secondary/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-secondary text-white shadow-md transition-all duration-300 ease-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
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

function CourseShimmer() {
  return (
    <div className="group relative h-[300px] w-full justify-between rounded-xl bg-white shadow">
      <div className="relative h-[60%] w-full">
        <div className="h-full w-full animate-pulse rounded-t-xl bg-gray-400 object-cover" />
      </div>
      <div className="flex h-[40%] flex-col justify-between gap-4 px-4 py-4 text-tertiary">
        <div className="h-6 w-[80%] animate-pulse bg-gray-400 text-base font-bold text-tertiary" />
        <div className="flex flex-col gap-1">
          <div className="h-3 animate-pulse bg-gray-400 text-sm font-semibold" />
          <div className="flex w-full gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-[25%] animate-pulse rounded-3xl bg-gray-400`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
