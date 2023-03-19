import Header from "components/common/head";
import Programs from "components/dashboard/programs.table";
import SelectTemplate from "components/dashboard/selectTemplate";
import AllTalents from "components/dashboard/talents.table";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOrgId } from "redux/auth/authSlice";
import { useGetOneOrganizationQuery } from "services/baseApiSlice";

export default function Dashboard() {
  const { data: session } = useSession();

  // get organization created by this user then set the orgId in state
  const userId = session?.user?.id;
  const { data } = useGetOneOrganizationQuery(userId, {
    skip: !userId,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setOrgId(data?.organization?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [showSelectTemplate, setShowSelectTemplate] = useState(false);

  const [countOfPrograms, setCountOfPrograms] = useState(0);

  return (
    <>
      <Header />
      <DashboardWrapper>
        <div className="relative mt-[20px] ml-[250px] text-tertiary">
          <h1 className="text-2xl font-bold">
            Hi, {session?.user?.name?.split(" ")[0]}
          </h1>
          <button
            onClick={() => setShowSelectTemplate(true)}
            className="absolute right-8 top-12 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
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
          <div className="mt-8 flex gap-8">
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
              text="Total Talents"
              num={0}
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
                  className="h-12 w-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              num={0}
            />
          </div>
          <section className="mt-8 mr-4 flex gap-2">
            <AllTalents />
            <Programs
              countOfPrograms={(num: number) => setCountOfPrograms(num)}
              showSelectTemplate={() => setShowSelectTemplate(true)}
            />
          </section>
        </div>
        {showSelectTemplate && (
          <SelectTemplate closeModal={() => setShowSelectTemplate(false)} />
        )}
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
    <div className="flex w-[300px] flex-col items-center gap-1 rounded-xl bg-tertiary p-2 text-white shadow-sm">
      <div className="">{svg}</div>

      <div className="flex items-center gap-2 text-center text-base">
        <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-secondary/50 p-2 text-base leading-normal">
          {num}
        </span>
        {text}
      </div>
    </div>
  );
}
