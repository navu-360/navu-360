import type { OnboardingProgramTalents, User } from "@prisma/client";
import Header from "components/common/head";
import Spinner from "components/common/spinner";
import MyEnrolledPrograms from "components/dashboard/myPrograms";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrgId, setOrganizationData } from "redux/auth/authSlice";
import {
  useGetOrganizationByIdQuery,
  useGetTalentEnrollmentsQuery,
} from "services/baseApiSlice";

export default function LearnCenter() {
  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile
  );

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
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
  const { data, isFetching } = useGetTalentEnrollmentsQuery(talentId, {
    skip: !talentId,
  });

  if (!isReady) return null;

  return (
    <>
      <Header
        title={`${organizationData?.organization?.name ?? ""} Learn Center`}
      />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[1rem] pt-8 text-tertiary md:ml-[250px]">
          <h1 className="w-full text-2xl font-bold capitalize">
            Hi, {userProfile?.name?.split(" ")[0] ?? ""}
          </h1>
          <div className="mt-8 flex w-[95%] flex-wrap gap-4 lg:justify-start lg:gap-5 2xl:mt-8">
            <OneStat
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              text="Total Enrolled Programs"
              num={data?.data?.length ?? 0}
            />
            <OneStat
              text="Completed Programs"
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m16 6 4 14"></path>
                  <path d="M12 6v14"></path>
                  <path d="M8 8v12"></path>
                  <path d="M4 4v16"></path>
                </svg>
              }
              num={
                data?.data?.filter(
                  (item: OnboardingProgramTalents) =>
                    item?.enrollmentStatus === "completed"
                ).length ?? 0
              }
            />
          </div>
          <section className="mr-4 mt-8 flex w-full max-w-full gap-2 pb-8">
            {isFetching || !data?.data ? (
              <div className="relative mt-[20px] flex h-full w-full flex-col items-center justify-center gap-8 md:min-h-[400px] md:w-[50%]">
                <Spinner />
              </div>
            ) : (
              <MyEnrolledPrograms data={data?.data} />
            )}
          </section>
        </div>
      </DashboardWrapper>
    </>
  );
}

function OneStat({
  svg,
  text,
  num,
}: {
  svg: React.ReactNode;
  text: string;
  num: number;
}) {
  return (
    <div className="stat-shadow flex w-full flex-row items-center gap-3  rounded-xl bg-tertiary p-2 text-white sm:w-max lg:w-[25%] lg:flex-col xl:min-w-[300px]">
      <div className="">{svg}</div>

      <div className="flex items-center gap-2 text-center text-base">
        <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-secondary/50 p-2 text-base leading-normal">
          {num}
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
