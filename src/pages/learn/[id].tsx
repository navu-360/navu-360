/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useState } from "react";
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  ProgramSection,
  QuizQuestion,
  User,
} from "@prisma/client";
import Image from "next/image";
import ChapterStrip from "components/learnCourse/chapterStrip";
import { generateAvatar } from "utils/avatar";
import ViewChapterLearn from "components/learnCourse/viewChapter";
import { TakeQuizQuestion } from "components/learnCourse/questionView";
import CourseDone from "components/learnCourse/courseComplete";

export default function ViewEnrollment({
  data,
}: {
  data: OnboardingProgramTalents & {
    OnboardingProgram: OnboardingProgram & {
      ProgramSection: ProgramSection[];
      QuizQuestion: QuizQuestion[];
      creator: User;
    };
  };
}) {
  const completedChapters = 1;
  const [showingIntro, setShowingIntro] = useState(true);
  const [chaptersDone, setChaptersDone] = useState(false);
  const [courseDone, setCourseDone] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<
    ProgramSection | undefined
  >(data?.OnboardingProgram?.ProgramSection[0]);

  const [quizDone, setQuizDone] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<
    QuizQuestion | undefined
  >();

  return (
    <>
      <Header title={`${data?.OnboardingProgram?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mr-4 mt-[30px] flex h-[calc(100vh_-_115px)] w-auto items-start justify-start rounded-md bg-gray-100 p-4 md:ml-[250px]">
          <div
            className={`relative flex h-full flex-col gap-8 ${
              courseDone ? "w-full" : "w-[calc(100%_-_350px)]"
            }`}
          >
            {showingIntro && (
              <>
                <h1 className="text-3xl font-bold text-tertiary">
                  {data?.OnboardingProgram?.name}
                </h1>
                <div className="relative h-[400px] w-full overflow-hidden">
                  <Image
                    className="relative z-50 h-full w-full object-contain"
                    fill
                    src={data?.OnboardingProgram?.image as string}
                    alt={data?.OnboardingProgram?.name}
                  />
                  <div
                    style={{
                      backgroundImage: `url(${
                        data?.OnboardingProgram?.image as string
                      })`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                    className="absolute inset-0 z-40 h-full w-full rounded-md bg-cover bg-no-repeat blur-sm"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-tertiary">
                    Description
                  </h3>
                  <p className="text-base font-medium text-gray-500">
                    {data?.OnboardingProgram?.description}
                  </p>
                </div>
                <div className="mt-4 flex w-full max-w-[600px] flex-col gap-2">
                  <h3 className="text-lg font-semibold text-tertiary">
                    Chapters
                  </h3>
                  <div className="flex flex-col gap-2">
                    {data?.OnboardingProgram?.ProgramSection?.map(
                      (section, index) => (
                        <ChapterStrip
                          key={section.id}
                          title={section?.name as string}
                          index={`0${index + 1}`}
                          done
                        />
                      ),
                    )}
                    {data?.OnboardingProgram?.QuizQuestion?.length > 0 && (
                      <div className="flex w-full items-center justify-around rounded-lg bg-gray-200 p-2 py-3 font-medium text-tertiary">
                        <span className="w-max font-semibold">
                          {data?.OnboardingProgram?.ProgramSection?.length}
                        </span>
                        <p className="w-[75%] text-sm">Course Quiz</p>
                        {quizDone ? (
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
                            className={`lucide lucide-check-circle text-green-500`}
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        ) : (
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
                            className="lucide lucide-circle-dashed text-gray-400"
                          >
                            <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
                            <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
                            <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
                            <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
                            <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
                            <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
                            <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
                            <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowingIntro(false)}
                  className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-4 md:mr-0"
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
                    className="lucide lucide-arrow-right-circle"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="m12 16 4-4-4-4" />
                  </svg>
                  <span>Start Course</span>
                </button>
              </>
            )}
            {!showingIntro && !courseDone && (
              <div className="flex h-[calc(100%_-_100px)] w-full flex-col gap-8 px-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-500">
                    Course: {data?.OnboardingProgram?.name}
                  </p>
                  <h1 className="text-3xl font-bold text-tertiary">
                    {chaptersDone ? "Course Quiz" : currentChapter?.name}
                  </h1>
                </div>

                {!chaptersDone && (
                  <ViewChapterLearn
                    chapter={currentChapter as ProgramSection}
                  />
                )}
                {chaptersDone && currentQuestion && (
                  <div className="mb-8 flex flex-col gap-4">
                    <TakeQuizQuestion
                      {...(currentQuestion as QuizQuestion)}
                      key={currentQuestion?.id}
                      goNext={(answer) => {
                        // record answer then go next question, if last question, evalaute talent quiz and show results and explanations
                        if (
                          data?.OnboardingProgram?.QuizQuestion?.[
                            data?.OnboardingProgram?.QuizQuestion?.length - 1
                          ]?.id === currentQuestion?.id
                        ) {
                          setQuizDone(true);
                          console.log("done");
                          return;
                        }
                        setCurrentQuestion(
                          data?.OnboardingProgram?.QuizQuestion?.[
                            data?.OnboardingProgram?.QuizQuestion?.findIndex(
                              (q) => q.id === currentQuestion?.id,
                            ) + 1
                          ],
                        );
                        console.log(answer);
                      }}
                      goPrev={() => {
                        // go to previous question
                        console.log("prev");
                        const currentIndex =
                          data?.OnboardingProgram?.QuizQuestion?.findIndex(
                            (q) => q.id === currentQuestion?.id,
                          ) ?? 0;
                        if (currentIndex > 0) {
                          setCurrentQuestion(
                            data?.OnboardingProgram?.QuizQuestion?.[
                              currentIndex - 1
                            ],
                          );
                        }
                      }}
                      isFirst={
                        data?.OnboardingProgram?.QuizQuestion?.[0]?.id ===
                        currentQuestion?.id
                      }
                      isLast={
                        data?.OnboardingProgram?.QuizQuestion?.[
                          data?.OnboardingProgram?.QuizQuestion?.length - 1
                        ]?.id === currentQuestion?.id
                      }
                    />
                  </div>
                )}
              </div>
            )}
            {courseDone && (
              <CourseDone
                viewCourse={() => {
                  setCourseDone(false);
                  setChaptersDone(false);
                  setCurrentChapter(
                    data?.OnboardingProgram?.ProgramSection[0] ?? undefined,
                  );
                  setShowingIntro(true);
                }}
              />
            )}

            {!showingIntro && !chaptersDone && !courseDone && (
              <div className="relative mt-auto flex h-[60px] w-full shrink-0 items-center justify-between rounded-b-md border-[1px] border-neutral-300 px-8">
                <button
                  disabled={
                    data?.OnboardingProgram?.ProgramSection[0]?.id ===
                    currentChapter?.id
                  }
                  onClick={() => {
                    // get index of current chapter
                    const index =
                      data?.OnboardingProgram?.ProgramSection?.findIndex(
                        (section) => section.id === currentChapter?.id,
                      );
                    // set current chapter to previous chapter
                    setCurrentChapter(
                      data?.OnboardingProgram?.ProgramSection?.[index - 1],
                    );
                  }}
                  className="text-teriary h-max w-max rounded-[5px] border-[1px] border-tertiary px-8 py-2 text-[14px] font-medium"
                >
                  Back
                </button>

                <button
                  onClick={() => {
                    setShowingIntro(false);
                    // get index of current chapter
                    const index =
                      data?.OnboardingProgram?.ProgramSection?.findIndex(
                        (section) => section.id === currentChapter?.id,
                      );
                    // check if already at last chapter
                    if (
                      index + 1 >=
                      data?.OnboardingProgram?.ProgramSection?.length
                    ) {
                      console.log("done");
                      if (data?.OnboardingProgram?.QuizQuestion?.length === 0) {
                        setCourseDone(true);
                      } else {
                        setCurrentQuestion(
                          data?.OnboardingProgram?.QuizQuestion?.[0],
                        );
                        setChaptersDone(true);
                      }

                      return;
                    }

                    // set current chapter to next chapter
                    setCurrentChapter(
                      data?.OnboardingProgram?.ProgramSection?.[index + 1],
                    );
                  }}
                  className="h-max w-max rounded-[5px] bg-secondary px-8 py-2 text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
          {!courseDone && (
            <div className="fixed bottom-5 right-4 top-[95px] z-50 flex h-auto w-[350px] flex-col gap-8 rounded-br-md rounded-tr-md border-l-[1px] border-gray-300 bg-gray-100 p-4 px-0">
              <div className="flex flex-col gap-6 px-4 text-tertiary">
                <h2 className="text-lg font-semibold">About the Course</h2>
                <div className="flex w-full items-center gap-1">
                  <div className="flex items-center gap-4">
                    <img
                      src={generateAvatar(
                        data?.OnboardingProgram?.creator?.name as string,
                      )}
                      className="h-[40px] w-[40px] rounded-full"
                      alt={data?.OnboardingProgram?.creator?.name as string}
                    />
                    <div className="flex flex-col gap-0">
                      <p className="text-base font-semibold text-tertiary">
                        {data?.OnboardingProgram?.creator?.name}
                      </p>
                      <span className="text-xs font-medium text-gray-500">
                        {data?.OnboardingProgram?.creator?.position}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-base font-medium text-gray-500">
                  {data?.OnboardingProgram?.description}
                </p>
              </div>
              <div className="h-[0.5px] w-full bg-gray-300" />
              {!showingIntro && (
                <div className="flex w-full flex-col gap-4 px-4">
                  <h3 className="text-lg font-semibold text-tertiary">
                    Course Completion
                  </h3>
                  <div className="flex w-full flex-col gap-2 text-sm font-medium text-gray-500">
                    <div className="flex w-full justify-between gap-0">
                      <span>
                        {(
                          (completedChapters /
                            (data?.OnboardingProgram?.ProgramSection?.length ||
                              0)) *
                          100
                        ).toFixed(0)}
                        % Completed
                      </span>
                      <span>
                        {completedChapters}/
                        {data.OnboardingProgram.ProgramSection?.length}
                      </span>
                    </div>
                    <div className="flex w-full flex-col gap-6">
                      <div className="flex w-full gap-2">
                        {[
                          ...Array(
                            data.OnboardingProgram.ProgramSection?.length,
                          ),
                        ].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: `${
                                (completedChapters /
                                  data.OnboardingProgram.ProgramSection
                                    ?.length) *
                                100
                              }%`,
                            }}
                            className={`h-2 rounded-3xl ${
                              i < completedChapters
                                ? "bg-secondary"
                                : "bg-secondary/20"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {data?.OnboardingProgram?.ProgramSection?.map(
                          (section, index) => (
                            <ChapterStrip
                              key={section.id}
                              title={section?.name as string}
                              index={`0${index + 1}`}
                              done
                            />
                          ),
                        )}
                        {data?.OnboardingProgram?.QuizQuestion?.length > 0 && (
                          <div className="flex w-full items-center justify-around rounded-lg bg-gray-200 p-2 py-3 font-medium text-tertiary">
                            <span className="w-max font-semibold">
                              {data?.OnboardingProgram?.ProgramSection?.length}
                            </span>
                            <p className="w-[75%] text-sm">Course Quiz</p>
                            {quizDone ? (
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
                                className={`lucide lucide-check-circle text-green-500`}
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                            ) : (
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
                                className="lucide lucide-circle-dashed text-gray-400"
                              >
                                <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
                                <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
                                <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
                                <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
                                <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
                                <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
                                <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
                                <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardWrapper>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}enrollment/get-all`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
    );
    const paths = res.data.data.map((program: OnboardingProgramTalents) => ({
      params: { id: program.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/enrollment/one/${params.id}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
    );
    if (res?.data?.data) {
      return {
        props: {
          data: res?.data?.data,
        },
        // revalidate every 24 hours
        revalidate: 60 * 60 * 24,
      };
    }

    return {
      props: {
        data: null,
      },
    };
  } catch (error) {
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
