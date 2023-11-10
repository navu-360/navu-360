/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Organization, User } from "@prisma/client";
import Header from "components/common/head";
import SearchResults from "components/common/searchResults";
import { NoCourses, WelcomeGuide } from "components/dashboard/guides";
import Programs from "components/dashboard/programs.table";
import SelectTemplate from "components/dashboard/selectTemplate";
import AllTalents from "components/dashboard/talents.table";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrgId, setOrganizationData } from "redux/auth/authSlice";
import { resetCommon, setDraftProgramId } from "redux/common/commonSlice";
import {
  useGetOneOrganizationQuery,
  useGetOrganizationEnrollmentsQuery,
  useGetOrganizationProgramsQuery,
  useUpdateUserMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";

export default function Dashboard() {
  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
  );

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData,
  );

  const { currentData: data } = useGetOneOrganizationQuery(undefined);

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

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(setDraftProgramId(undefined));
    dispatch(resetCommon());
  }, [dispatch]);

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

  // get programs created by this organization
  const { data: programs, isFetching } = useGetOrganizationProgramsQuery(
    orgId,
    {
      skip: !orgId,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (programs) {
      setCountOfPrograms(programs?.data?.length || 0);
    }
  }, [programs]);

  const searchQuery = useSelector((state: any) => state.common.searchQuery);

  const organizationId = orgId;
  const { data: enrollments } = useGetOrganizationEnrollmentsQuery(
    organizationId,
    {
      skip: !organizationId,
      refetchOnMountOrArgChange: true,
    },
  );

  const getEnrolledTalentsFromEnrollments = () => {
    // from data?.data, we get all data?.data[0]?.user where it an object for user, has field id. From all enrollments, get the users then remove duplicates
    const enrolledTalents = enrollments?.data?.map(
      (enrollment: any) => enrollment?.User,
    );
    const uniqueEnrolledTalents = Array.from(
      new Set(enrolledTalents?.map((a: User) => a?.id)),
    ).map((id) => {
      return enrolledTalents?.find((a: User) => a?.id === id);
    });
    return uniqueEnrolledTalents;
  };

  const { data: session, update, status } = useSession();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const hasSeenGuide = async () => {
    const body = {
      seenWelcomeGuide: true,
    };
    await updateUser(body)
      .unwrap()
      .then(() => {
        update();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.message,
        });
      });
  };

  if (!isReady) return null;

  return (
    <>
      <Header title={`${organizationData?.name ?? ""} | Dashboard`} />
      <DashboardWrapper>
        {status !== "loading" &&
          (searchQuery?.length === 0 ? (
            <>
              {!session?.user?.seenWelcomeGuide && (
                <WelcomeGuide
                  awesome={() => {
                    hasSeenGuide();
                  }}
                  loading={isLoading}
                />
              )}
              {session?.user?.seenWelcomeGuide && (
                <>
                  <div className="relative ml-[90px] mr-4 mt-[2rem] flex justify-between text-tertiary md:ml-[230px]">
                    <h1 className="text-2xl font-bold">
                      Hi, {userProfile?.name?.split(" ")[0] ?? ""}
                    </h1>
                    {programs && (
                      <button
                        disabled={isFetching}
                        onClick={() => router.push("/create/program")}
                        className={`z-50 flex h-max min-h-[45px] w-max min-w-[150px] shrink-0 items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-secondary/90 focus:outline-none focus:ring-4 ${
                          programs?.data?.length > 0 || isFetching
                            ? ""
                            : "hidden"
                        }`}
                      >
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
                          className="lucide lucide-plus-circle"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12h8" />
                          <path d="M12 8v8" />
                        </svg>

                        <span className="w-max">Create Course</span>
                      </button>
                    )}
                  </div>
                  <div className="relative ml-[90px] mr-4 mt-[3rem] flex justify-between text-tertiary md:ml-[230px]">
                    <section className="flex w-[70%] flex-col">
                      <div className="mt-0 grid w-full grid-cols-3 gap-4 lg:justify-between lg:gap-4 2xl:mt-0">
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
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          }
                          text={`Total Talents`}
                          num={getEnrolledTalentsFromEnrollments()?.length ?? 0}
                          roundLastCard={programs?.data?.length === 0}
                        />
                        <OneStat
                          text={`Total Courses`}
                          svg={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="52"
                              height="52"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="h-6 w-6 md:h-12 md:w-12"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m16 6 4 14"></path>
                              <path d="M12 6v14"></path>
                              <path d="M8 8v12"></path>
                              <path d="M4 4v16"></path>
                            </svg>
                          }
                          num={countOfPrograms}
                          roundLastCard={programs?.data?.length === 0}
                        />
                        <OneStat
                          text={`Total Enrollments`}
                          svg={
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
                              className="h-6 w-6 md:h-12 md:w-12"
                            >
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                          }
                          num={enrollments?.data?.length ?? 0}
                          roundLastCard={programs?.data?.length === 0}
                        />
                      </div>
                      <section className="mt-8 flex min-h-[65vh] w-full flex-col justify-between gap-2 lg:flex-row">
                        {(programs?.data?.length > 0 ||
                          (isFetching && !programs)) && (
                          <AllTalents
                            sendTotalTalents={() => console.log("")}
                            setTotalOnboarded={() => console.log("")}
                            onboardingPrograms={programs?.data}
                          />
                        )}

                        {session?.user?.seenWelcomeGuide &&
                          programs?.data?.length === 0 &&
                          !isFetching && (
                            <NoCourses
                              showSelectTemplate={() =>
                                setShowSelectTemplate(true)
                              }
                            />
                          )}
                      </section>
                    </section>

                    <Programs
                      data={programs?.data}
                      isFetching={isFetching}
                      showSelectTemplate={() => setShowSelectTemplate(true)}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <SearchResults />
          ))}
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
  roundLastCard,
}: {
  svg: React.ReactNode;
  text: string;
  num: number;
  roundLastCard: boolean;
}) {
  return (
    <div
      className={`stat-shadow flex w-full flex-row items-center gap-3 bg-dark p-2 text-white transition-all duration-300 ease-in first:rounded-tl-3xl sm:w-max lg:w-full lg:flex-col ${
        roundLastCard ? "last:rounded-tr-3xl" : "last:rounded-r-none"
      }`}
    >
      <div className="">{svg}</div>

      <div className="mb-4 flex items-center gap-2 text-center text-base">
        <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white p-2 text-base font-medium leading-normal text-secondary">
          {num}
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
