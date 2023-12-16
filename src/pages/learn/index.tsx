/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  ProgramSection,
  QuizQuestion,
  User,
} from "@prisma/client";
import Header from "components/common/head";
import SearchResults from "components/common/searchResults";
import { NoAssignedCourses } from "components/dashboard/guides";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrgId, setOrganizationData } from "redux/auth/authSlice";
import { setAllTalentCourses } from "redux/common/commonSlice";
import {
  useGetEnrollmentStatusQuery,
  useGetOrganizationByIdQuery,
  useGetTalentEnrollmentsQuery,
} from "services/baseApiSlice";

export default function LearnCenter() {
  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
  );

  const { data: session } = useSession();

  const id = session?.user?.talentOrgId;
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
  const { currentData: data, isFetching } = useGetTalentEnrollmentsQuery(
    talentId,
    {
      skip: !talentId,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (data?.data?.length > 0) {
      const allCourses = data?.data?.map(
        (program: any) => program.OnboardingProgram,
      );
      dispatch(setAllTalentCourses(allCourses));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const searchQuery = useSelector((state: any) => state.common.searchQuery);

  const [activeTab, setActiveTab] = useState("all");

  if (!isReady) return null;

  return (
    <>
      <Header
        title={`${organizationData?.organization?.name ?? ""} Learn Center`}
      />
      <DashboardWrapper>
        {searchQuery?.length > 0 ? (
          <SearchResults />
        ) : (
          <div className="relative ml-[90px] mt-[1rem] pr-4 pt-8 text-tertiary md:ml-[250px]">
            {(data?.data?.length > 0 || isFetching) && (
              <>
                <h1 className="w-full text-2xl font-bold capitalize">
                  My Courses
                </h1>
                <div className="mt-8 hidden items-center gap-4">
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
              </>
            )}
            {data?.data?.length > 0 && (
              <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
                {data?.data?.map(
                  (
                    program: OnboardingProgramTalents & {
                      OnboardingProgram: OnboardingProgram & {
                        ProgramSection: ProgramSection[];
                        QuizQuestion: QuizQuestion[];
                      };
                    },
                  ) => (
                    <OneCourse
                      image={program.OnboardingProgram.image as string}
                      key={program.id}
                      title={program.OnboardingProgram.name}
                      numofChapters={
                        program.OnboardingProgram.ProgramSection?.length
                      }
                      id={program.id}
                      programId={program.OnboardingProgram.id}
                      hasQuiz={
                        program.OnboardingProgram.QuizQuestion?.length > 0
                      }
                      programChapters={program.OnboardingProgram.ProgramSection}
                    />
                  ),
                )}
              </div>
            )}
            <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
              {!data && (
                <>
                  <CourseShimmer />
                  <CourseShimmer />
                  <CourseShimmer />
                  <CourseShimmer />
                </>
              )}
            </div>

            {data?.data?.length === 0 && <NoAssignedCourses />}
          </div>
        )}
      </DashboardWrapper>
    </>
  );
}

export function OneCourse({
  image,
  title,
  numofChapters,
  programId,
  id,
  hasQuiz,
  programChapters,
}: {
  image: string;
  title: string;
  numofChapters: number;
  id: string;
  programId: string;
  hasQuiz: boolean;
  programChapters: ProgramSection[];
}) {
  const { data: enrollmentStatus } = useGetEnrollmentStatusQuery(
    { programId },
    {
      skip: !programId,
    },
  );

  const doneSections =
    enrollmentStatus?.data?.viewedChapters?.length +
    (enrollmentStatus?.data?.quizCompleted ? 1 : 0);
  const requiredSections = numofChapters + (hasQuiz ? 1 : 0);

  const classifyChapters = () => {
    // output format: [{type: "readings", count: 2, svg:svg}, {type: "videos", count: 2, svg:svg},{type: "quizzes", count: 2, svg:svg},{type: "PDFs", count: 2, svg:svg},{type: "googleDocs", count: 2, svg:svg"}]
    // for type readings - we count all programChapters with type === block
    // for type videos - we count all programChapters with type === video
    // for type quizzes - count will be 1 if hasQuiz is true
    // for type PDFs - we count all programChapters with type === document
    // for type googleDocs - we count all programChapters with type === link

    const readings = programChapters.filter(
      (chapter) => chapter.type === "block",
    );
    const videos = programChapters.filter(
      (chapter) => chapter.type === "video",
    );
    const PDFs = programChapters.filter(
      (chapter) => chapter.type === "document",
    );
    const googleDocs = programChapters.filter(
      (chapter) => chapter.type === "link",
    );
    const quizzes = hasQuiz ? 1 : 0;

    return [
      {
        type: "readings",
        count: readings.length,
        svg: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-indent"
          >
            <polyline points="3 8 7 12 3 16" />
            <line x1="21" x2="11" y1="12" y2="12" />
            <line x1="21" x2="11" y1="6" y2="6" />
            <line x1="21" x2="11" y1="18" y2="18" />
          </svg>
        ),
      },
      {
        svg: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-youtube text-currentColor"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
          </svg>
        ),
        type: "videos",
        count: videos.length,
      },
      {
        svg: (
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
            height={20}
            width={20}
            alt="Add a Document"
          />
        ),
        type: "PDFs",
        count: PDFs.length,
      },
      {
        svg: (
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            height={24}
            width={24}
            alt="Add a Link for Google Docs or Google Slides"
          />
        ),
        type: "googleDocs",
        count: googleDocs.length,
      },
      {
        svg: (
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
            className="lucide lucide-list-checks"
          >
            <path d="m3 17 2 2 4-4" />
            <path d="m3 7 2 2 4-4" />
            <path d="M13 6h8" />
            <path d="M13 12h8" />
            <path d="M13 18h8" />
          </svg>
        ),
        type: "quiz",
        count: quizzes,
      },
    ];
  };

  return (
    <Link
      href={
        doneSections === requiredSections
          ? `/learn/${id}?preview=true`
          : `/learn/${id}`
      }
      className="question-input group relative h-[350px] w-full justify-between rounded-xl bg-white"
    >
      <div className="relative h-[40%] w-full">
        <Image
          className="h-full w-full rounded-t-xl object-cover"
          src={image}
          fill
          alt="Course"
        />
      </div>

      {/* <div className="overlay-course" /> */}
      <div className="flex h-[40%] flex-col justify-between gap-4 px-4 py-4 text-tertiary">
        <div className="h-[50px] w-full shrink-0">
          <h2 className="w-[80%] text-base font-bold text-tertiary">
            {title?.length > 60 ? title?.slice(0, 60) + "..." : title}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-start">
            {classifyChapters()
              .filter((x) => x.count > 0)
              .map((chapter, i) => (
                <div
                  key={i}
                  className={`flex h-[50px] flex-col items-center justify-between gap-1 ${
                    i === 0 ? "ml-0" : "ml-4"
                  }`}
                >
                  {chapter.svg}
                  <span className="text-xs font-medium text-gray-600">
                    {chapter.count} {chapter.type}
                  </span>
                </div>
              ))}
          </div>
          {enrollmentStatus?.data?.viewedChapters ? (
            <div className="flex flex-col gap-1">
              {doneSections === requiredSections ? (
                <span className="text-sm font-semibold">100%</span>
              ) : (
                <span className="text-sm font-semibold">
                  {doneSections}/{requiredSections}
                </span>
              )}
              <div className="flex w-full gap-2">
                {[...Array(requiredSections)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${(1 / requiredSections) * 100}%`,
                    }}
                    className={`h-2 rounded-3xl ${
                      i < doneSections ? "bg-secondary" : "bg-secondary/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="h-4 w-8 animate-pulse rounded-lg bg-gray-300"></div>
              <div className="flex w-full">
                <div className={`h-3 w-1/3 rounded-3xl bg-gray-300`} />
                <div className={`h-3 w-1/3 rounded-3xl bg-gray-300`} />
                <div className={`h-3 w-1/3 rounded-3xl bg-gray-300`} />
              </div>
            </div>
          )}
        </div>
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
