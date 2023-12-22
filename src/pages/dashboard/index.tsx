/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Organization, User } from "@prisma/client";
import Header from "components/common/head";
import SearchResults from "components/common/searchResults";
import CreateLearningPath from "components/createProgram/createLearningPath/main";
import { NoCourses, WelcomeGuide } from "components/dashboard/guides";
import Programs from "components/dashboard/programs.table";
import SelectTemplate from "components/dashboard/selectTemplate";
import AllTalents from "components/dashboard/talents.table";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, []);

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

  useEffect(() => {
    dispatch(setDraftProgramId(undefined));
    dispatch(resetCommon());
  }, [dispatch]);

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

  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const { create } = router.query;

  if (!isReady) return null;

  return (
    <>
      <Header title={`${organizationData?.name ?? ""} | Dashboard`} />
      <DashboardWrapper>
        {searchQuery?.length === 0 ? (
          <>
            {!session?.user?.seenWelcomeGuide && status !== "loading" && (
              <WelcomeGuide
                awesome={() => {
                  hasSeenGuide();
                }}
                loading={isLoading}
              />
            )}
            {session?.user?.seenWelcomeGuide && (
              <>
                <div className="relative ml-[90px] mr-4 mt-[2rem] flex justify-between text-tertiary md:ml-[250px]">
                  <h1 className="text-2xl font-bold">
                    Hi, {userProfile?.name?.split(" ")[0] ?? ""}
                  </h1>
                  {programs && (
                    <button
                      disabled={isFetching}
                      onClick={() => setShowCreateDropdown(true)}
                      className={`z-50 flex h-max min-h-[45px] w-max min-w-[150px] shrink-0 items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-secondary/90 focus:outline-none focus:ring-4 ${
                        programs?.data?.length > 0 || isFetching ? "" : "hidden"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-plus-circle"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>

                      <span className="w-max">Create</span>
                    </button>
                  )}
                </div>
                <div className="relative ml-[90px] mr-4 mt-[3rem] flex justify-between text-tertiary md:ml-[250px]">
                  <section className="flex w-full flex-col md:w-[70%]">
                    <div className="mt-0 grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:justify-between lg:gap-4 2xl:mt-0">
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
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
        )}
        <AnimatePresence>
          {showSelectTemplate && (
            <SelectTemplate closeModal={() => setShowSelectTemplate(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreateDropdown && (
            <CreateOptions close={() => setShowCreateDropdown(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {create === "path" && (
            <CreateLearningPath
              closeModal={() => {
                router.push("/dashboard");
              }}
            />
          )}
        </AnimatePresence>
      </DashboardWrapper>
    </>
  );
}

function CreateOptions({ close }: { close: () => void }) {
  const options = [
    {
      id: 0,
      label: "Create Learning Path",
      description: "Create a new learning path by combining courses",
      icon: (
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
          className="text-secondary transition-all duration-300 ease-in group-hover:rotate-12"
        >
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="m10.2 6.3-3.9 3.9" />
          <circle cx="4.5" cy="12" r="2.5" />
          <path d="M7 12h10" />
          <circle cx="19.5" cy="12" r="2.5" />
          <path d="m13.8 17.7 3.9-3.9" />
          <circle cx="12" cy="19.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: 1,
      label: "Create Course",
      description:
        "Create a new course with new chapters or select chapters from your library",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary transition-all duration-300 ease-in group-hover:rotate-12"
        >
          <path d="M2 16V4a2 2 0 0 1 2-2h11" />
          <path d="M5 14H4a2 2 0 1 0 0 4h1" />
          <path d="M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12" />
        </svg>
      ),
    },
  ];
  return (
    <div
      onClick={(e) => (e.currentTarget === e.target ? close() : null)}
      className="fixed inset-0 z-[200] flex h-screen w-screen justify-end bg-dark/30 pr-4 pt-[10rem] backdrop-blur-sm lg:pr-8 lg:pt-[12rem]"
    >
      <div className="relative flex h-max w-max max-w-md flex-col gap-4 rounded-lg bg-white p-4 shadow">
        <div
          onClick={() => close()}
          className="absolute -right-4 -top-12 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-50"
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
            className="lucide lucide-x text-gray-400"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold capitalize text-dark">
          What do you want to create?
        </h2>
        {options.map((item, i) => (
          <Link
            key={i}
            href={item.id === 1 ? "/create/program" : "/dashboard?create=path"}
            className="group flex cursor-pointer items-center gap-4 pr-4 transition-all duration-300 ease-in hover:bg-neutral-100"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-neutral-200">
              {item.icon}
            </div>
            <div className="flex flex-col gap-0">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.label}
              </h2>
              <p className="text-sm font-medium text-gray-500">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
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
      className={`stat-shadow flex w-full flex-row items-center gap-3 bg-dark p-2 text-white transition-all duration-300 ease-in sm:w-max md:first:rounded-tl-3xl lg:w-full lg:flex-col ${
        roundLastCard ? "md:last:rounded-tr-3xl" : "md:last:rounded-r-none"
      }`}
    >
      <div className="">{svg}</div>

      <div className="flex items-center gap-2 text-center text-base md:mb-4">
        <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white p-2 text-base font-medium leading-normal text-secondary">
          {num}
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
