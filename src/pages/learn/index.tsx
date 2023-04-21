import type { OnboardingProgramTalents, User } from "@prisma/client";
import Header from "components/common/head";
import MyEnrolledPrograms from "components/dashboard/myPrograms";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { useSession } from "next-auth/react";
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

  const { data: session } = useSession();

  const id = session?.user?.orgId;
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
  const talentId = session?.user?.id;
  const { data } = useGetTalentEnrollmentsQuery(talentId, {
    skip: !talentId,
  });

  console.log(data);

  if (!isReady) return null;

  return (
    <>
      <Header
        title={`${organizationData?.organization?.name ?? ""} Learn Center`}
      />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[1rem] text-tertiary">
          <h1 className="w-full text-2xl font-bold">
            Hi, {userProfile?.name?.split(" ")[0] ?? ""}
          </h1>
          <div className="mt-16 flex w-[98%] justify-start gap-6 2xl:mt-8">
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
          <section className="mr-4 mt-8 flex w-full max-w-full gap-2">
            <MyEnrolledPrograms data={data?.data ?? []} />
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
    <div className="stat-shadow flex w-1/4 min-w-[300px] flex-col items-center gap-1 rounded-xl bg-tertiary p-2 text-white">
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
