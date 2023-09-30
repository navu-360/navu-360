import type { OnboardingProgram, Organization, User } from "@prisma/client";
import Header from "components/common/head";
import Programs from "components/dashboard/programs.table";
import SelectTemplate from "components/dashboard/selectTemplate";
import AllTalents from "components/dashboard/talents.table";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrgId, setOrganizationData } from "redux/auth/authSlice";
import { useGetOneOrganizationQuery } from "services/baseApiSlice";

export default function Dashboard() {
  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile
  );

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData
  );

  // get organization created by this user then set the orgId in state
  const userId = userProfile?.id;
  const { data } = useGetOneOrganizationQuery(userId, {
    skip: !userId || !!orgId,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setOrgId(data?.organization?.id));
      dispatch(setOrganizationData(data?.organization));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [showSelectTemplate, setShowSelectTemplate] = useState(false);

  const [countOfPrograms, setCountOfPrograms] = useState(0);
  const [countOfTalents, setCountOfTalents] = useState(0);
  const [countOfOnboarded, setCountOfOnboarded] = useState(0);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (userProfile?.role === "talent") {
      router.push("/learn");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const [onboardingPrograms, setOnboardingPrograms] = useState<
    OnboardingProgram[]
  >([]);

  if (!isReady) return null;

  return (
    <>
      <Header title={`${organizationData?.name ?? ""} | Dashboard - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mr-4 mt-[3rem] text-tertiary md:ml-[230px]">
          <h1 className="w-full text-2xl font-bold">
            Hi, {userProfile?.name?.split(" ")[0] ?? ""}
          </h1>
          <button
            onClick={() => setShowSelectTemplate(true)}
            className="fixed bottom-2 right-2 z-50 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-[#fa3264] focus:outline-none focus:ring-4 md:absolute md:right-0 md:top-0 md:mr-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                clipRule="evenodd"
              />
            </svg>

            <span>Create Program</span>
          </button>
          <div className="mt-16 flex w-full flex-wrap gap-4 lg:justify-between lg:gap-0 2xl:mt-8">
            <OneStat
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  className="h-6 w-6 md:h-12 md:w-12"
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
              text="Total Talents"
              num={countOfTalents}
            />
            <OneStat
              text="Total Programs"
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  className="h-6 w-6 md:h-12 md:w-12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m16 6 4 14"></path>
                  <path d="M12 6v14"></path>
                  <path d="M8 8v12"></path>
                  <path d="M4 4v16"></path>
                </svg>
              }
              num={countOfPrograms}
            />
            <OneStat
              text="Total Onboarded"
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 md:h-12 md:w-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              num={countOfOnboarded}
            />
          </div>
          <section className="mt-8 flex w-full flex-col justify-between gap-2 lg:flex-row">
            <AllTalents
              sendTotalTalents={(num: number) => setCountOfTalents(num)}
              setTotalOnboarded={(num: number) => setCountOfOnboarded(num)}
              onboardingPrograms={onboardingPrograms}
            />
            <Programs
              countOfPrograms={(num: number) => setCountOfPrograms(num)}
              showSelectTemplate={() => setShowSelectTemplate(true)}
              setPrograms={(programs: OnboardingProgram[]) =>
                setOnboardingPrograms(programs)
              }
            />
          </section>
        </div>
        <AnimatePresence>
          {showSelectTemplate && (
            <SelectTemplate closeModal={() => setShowSelectTemplate(false)} />
          )}
        </AnimatePresence>
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
    <div className="stat-shadow flex w-full flex-row items-center gap-3 rounded-xl bg-tertiary p-2 text-white sm:w-max lg:w-[25%] lg:flex-col xl:min-w-[300px]">
      <div className="">{svg}</div>

      <div className="flex items-center gap-2 text-center text-base">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-secondary p-2 text-base leading-normal">
          {num}
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
