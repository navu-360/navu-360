/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";
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
import {
  useComputeScoreForQuizMutation,
  useGetEnrollmentStatusQuery,
  useGetTalentResultsQuery,
  useRecordCourseEventMutation,
  useRecordQuizAnswerMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";
import { useRouter } from "next/router";
import { processDate } from "utils/date";

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

  const router = useRouter();
  const { preview } = router.query;

  const programId = data?.OnboardingProgram?.id;
  const { data: results, refetch } = useGetTalentResultsQuery(programId, {
    skip: !programId,
  });

  const [recordEvent, { isLoading }] = useRecordCourseEventMutation();
  const [recordAnswer, { isLoading: recordingAnswer }] =
    useRecordQuizAnswerMutation();
  const [computeScore, { isLoading: computing }] =
    useComputeScoreForQuizMutation();

  const body = {
    programId: data?.OnboardingProgram?.id,
  };
  const { data: enrollmentStatus } = useGetEnrollmentStatusQuery(body, {
    skip: !data?.OnboardingProgram?.id,
    refetchOnMountOrArgChange: true,
  });

  const [completeChapters, setCompleteChapters] = useState<string[]>([]);

  const addChapterToDone = (chapterId: string) => {
    // check if chapter is already in completeChapters
    if (completeChapters.includes(chapterId)) {
      return;
    }
    // add chapter to completeChapters
    setCompleteChapters([...completeChapters, chapterId]);
  };

  const recordViewCourse = async () => {
    const body = {
      programId: data?.OnboardingProgram?.id,
      viewedCourse: true,
    };
    if (preview) {
      setShowingIntro(false);
      return;
    }
    recordEvent(body)
      .unwrap()
      .then(() => {
        recordViewChapter(
          data?.OnboardingProgram?.ProgramSection?.[0]?.id as string,
          true,
        );
        // setShowingIntro(false);
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const recordViewChapter = async (chapterId: string, hideIntro = false) => {
    const body = {
      programId: data?.OnboardingProgram?.id,
      viewChapterId: chapterId,
    };
    if (preview) {
      if (hideIntro) {
        setShowingIntro(false);
      }
      return;
    }

    if (enrollmentStatus?.data?.viewedChapters?.includes(chapterId)) {
      if (hideIntro) {
        setShowingIntro(false);
      }
      return;
    }
    recordEvent(body)
      .unwrap()
      .then(() => {
        if (hideIntro) {
          setShowingIntro(false);
        }
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const recordCourseCompleted = async () => {
    const body = {
      programId: data?.OnboardingProgram?.id,
      courseCompleted: true,
    };
    if (preview) {
      setCourseDone(true);
      return;
    }
    recordEvent(body)
      .unwrap()
      .then(() => {
        setCourseDone(true);
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const computeQuiz = async () => {
    const body = {
      programId: data?.OnboardingProgram?.id,
    };
    if (preview) {
      setCourseDone(true);
      return;
    }
    computeScore(body)
      .unwrap()
      .then(() => {
        refetch();
        setQuizDone(true);
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const recordAnswerQuiz = async (
    questionId: string,
    talentAnswer: string,
    isLastQuestion = false,
  ) => {
    const body = {
      programId: data?.OnboardingProgram?.id,
      questionId,
      talentAnswer,
    };
    if (preview) {
      setCurrentQuestion(
        data?.OnboardingProgram?.QuizQuestion?.[
          data?.OnboardingProgram?.QuizQuestion?.findIndex(
            (q) => q.id === currentQuestion?.id,
          ) + 1
        ],
      );
      return;
    }
    recordAnswer(body)
      .unwrap()
      .then(() => {
        if (isLastQuestion) {
          const body = {
            programId: data?.OnboardingProgram?.id,
            quizCompleted: true,
          };
          recordEvent(body)
            .unwrap()
            .then(() => {
              computeQuiz();
            })
            .catch((error) => {
              toaster({
                status: "error",
                message: error?.data?.message,
              });
            });
        } else {
          setCurrentQuestion(
            data?.OnboardingProgram?.QuizQuestion?.[
              data?.OnboardingProgram?.QuizQuestion?.findIndex(
                (q) => q.id === currentQuestion?.id,
              ) + 1
            ],
          );
        }
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  useEffect(() => {
    if (enrollmentStatus?.data && !preview) {
      // setShowingIntro - enrollmentStatus?.data.viewedCourse
      setShowingIntro(!enrollmentStatus?.data.viewedCourse);
      //setChaptersDone - if enrollmentStatus?.data.viewedChapters === data?.OnboardingProgram?.ProgramSection?.length
      setChaptersDone(
        enrollmentStatus?.data.viewedChapters ===
          data?.OnboardingProgram?.ProgramSection?.length,
      );
      setCompleteChapters(enrollmentStatus?.data.viewedChapters ?? []);
      //setCurrentChapter - check current viewed chapters, find latest chapter, get its index, set current chapter to next chapter
      const latestViewed = data?.OnboardingProgram?.ProgramSection.find(
        (section) =>
          section.id ===
          enrollmentStatus?.data?.viewedChapters[
            enrollmentStatus?.data?.viewedChapters.length - 1
          ],
      );
      const latestViewedIndex =
        data?.OnboardingProgram?.ProgramSection?.findIndex(
          (section) => section.id === latestViewed?.id,
        );
      setCurrentChapter(
        data?.OnboardingProgram?.ProgramSection?.[latestViewedIndex + 1],
      );
      if (enrollmentStatus?.data?.viewedChapters?.length > 0) {
        if (
          enrollmentStatus?.data?.viewedChapters?.length ===
          data?.OnboardingProgram?.ProgramSection?.length
        ) {
          if (data?.OnboardingProgram?.QuizQuestion?.length === 0) {
            recordCourseCompleted();
          } else {
            setCurrentQuestion(data?.OnboardingProgram?.QuizQuestion?.[0]);
            setChaptersDone(true);
          }
        } else {
          recordViewChapter(
            data?.OnboardingProgram?.ProgramSection?.[latestViewedIndex + 1]
              ?.id as string,
          );
        }
      }

      // setCourseDone - if enrollmentStatus?.data.courseCompleted
      setCourseDone(enrollmentStatus?.data.courseCompleted);
      // setQuizDone - if enrollmentStatus?.data.quizCompleted
      setQuizDone(enrollmentStatus?.data.quizCompleted);
    }
    if (enrollmentStatus?.data) {
      if (completeChapters?.length === 0) {
        setCompleteChapters(enrollmentStatus?.data.viewedChapters ?? []);
      }
      if (!courseDone) {
        // setCourseDone - if enrollmentStatus?.data.courseCompleted
        setCourseDone(enrollmentStatus?.data.courseCompleted);
      }
      if (!quizDone) {
        // setQuizDone - if enrollmentStatus?.data.quizCompleted
        setQuizDone(enrollmentStatus?.data.quizCompleted);
      }
      if (preview) {
        setCourseDone(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentStatus?.data, data?.OnboardingProgram, preview]);

  return (
    <>
      <Header title={`${data?.OnboardingProgram?.name}`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mr-4 mt-[20px] flex h-[calc(100vh_-_105px)] w-auto flex-col items-start justify-start rounded-md bg-gray-100 p-4 md:ml-[250px] md:flex-row">
          {enrollmentStatus?.data && (
            <>
              <div
                className={`no-scrollbar relative flex h-full flex-col gap-6 overflow-y-auto ${
                  courseDone ? "w-full" : "w-full md:w-[calc(100%_-_350px)]"
                }`}
              >
                {showingIntro && (
                  <>
                    <h1 className="text-3xl font-bold text-tertiary">
                      {data?.OnboardingProgram?.name}
                    </h1>
                    <div className="relative h-[250px] w-full shrink-0 overflow-hidden 2xl:h-[400px]">
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
                      <p className="max-w-2xl text-base font-medium text-gray-500">
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
                              done={
                                completeChapters?.includes(section.id) ?? false
                              }
                            />
                          ),
                        )}
                        {data?.OnboardingProgram?.QuizQuestion?.length > 0 && (
                          <div className="flex w-full items-center justify-around rounded-lg bg-gray-200 p-2 py-3 font-medium text-tertiary">
                            <span className="w-max font-semibold">
                              0
                              {data?.OnboardingProgram?.ProgramSection?.length +
                                1}
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
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                      onClick={() => {
                        recordViewCourse();
                      }}
                      disabled={isLoading}
                      className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-4 md:mr-0"
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
                        className="lucide lucide-arrow-right-circle"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="m12 16 4-4-4-4" />
                      </svg>
                      <span>{preview ? "View" : "Start"} Course</span>
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
                    {chaptersDone &&
                      currentQuestion &&
                      (quizDone ? (
                        <div className="mb-8 flex flex-col gap-4">
                          <div className="flex w-full flex-col">
                            <h3>
                              You scored{" "}
                              <span className="font-semibold text-secondary">
                                {results?.data?.score}%
                              </span>{" "}
                              in the quiz
                            </h3>
                          </div>
                          {data?.OnboardingProgram?.QuizQuestion?.map(
                            (currentQuestion) => (
                              <TakeQuizQuestion
                                {...(currentQuestion as QuizQuestion)}
                                key={currentQuestion?.id}
                                goNext={() => {
                                  console.log("");
                                }}
                                goPrev={() => {
                                  console.log("");
                                }}
                                isFirst={
                                  data?.OnboardingProgram?.QuizQuestion?.[0]
                                    ?.id === currentQuestion?.id
                                }
                                isLast={
                                  data?.OnboardingProgram?.QuizQuestion?.[
                                    data?.OnboardingProgram?.QuizQuestion
                                      ?.length - 1
                                  ]?.id === currentQuestion?.id
                                }
                                isLoading={recordingAnswer}
                                quizDone
                                talentAnswer={
                                  results?.data?.results?.find(
                                    (result: any) =>
                                      result.questionId === currentQuestion?.id,
                                  )?.talentAnswer
                                }
                                correctAnswer={
                                  results?.data?.results?.find(
                                    (result: any) =>
                                      result.questionId === currentQuestion?.id,
                                  )?.Question?.answer
                                }
                              />
                            ),
                          )}
                          <div className="mt-8 flex w-full items-center gap-8">
                            <button
                              disabled={isLoading}
                              onClick={() => recordCourseCompleted()}
                              className="rounded-md bg-secondary px-8 py-1.5 text-base font-semibold text-white"
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-8 flex flex-col gap-4">
                          <TakeQuizQuestion
                            {...(currentQuestion as QuizQuestion)}
                            key={currentQuestion?.id}
                            quizDone={false}
                            goNext={(answer) => {
                              // record answer then go next question, if last question, evalaute talent quiz and show results and explanations
                              if (
                                data?.OnboardingProgram?.QuizQuestion?.[
                                  data?.OnboardingProgram?.QuizQuestion
                                    ?.length - 1
                                ]?.id === currentQuestion?.id
                              ) {
                                recordAnswerQuiz(
                                  currentQuestion?.id as string,
                                  answer,
                                  true,
                                );

                                return;
                              }
                              recordAnswerQuiz(
                                currentQuestion?.id as string,
                                answer,
                              );
                            }}
                            goPrev={() => {
                              // go to previous question
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
                                data?.OnboardingProgram?.QuizQuestion?.length -
                                  1
                              ]?.id === currentQuestion?.id
                            }
                            isLoading={recordingAnswer || computing}
                          />
                        </div>
                      ))}
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
                      if (!preview) {
                        // add preview query to url
                        router.push(`${router.asPath}?preview=true`);
                        // refetchStatus();
                      }
                    }}
                  />
                )}

                {!showingIntro && !chaptersDone && !courseDone && (
                  <div className="relative mt-auto flex h-[60px] w-full shrink-0 items-center justify-between rounded-b-md border-[1px] border-neutral-300 px-2 md:px-8">
                    <button
                      disabled={
                        data?.OnboardingProgram?.ProgramSection[0]?.id ===
                        currentChapter?.id
                      }
                      onClick={() => {
                        if (currentChapter) {
                          // get index of current chapter
                          const index =
                            data?.OnboardingProgram?.ProgramSection?.findIndex(
                              (section) => section.id === currentChapter?.id,
                            );
                          // set current chapter to previous chapter
                          setCurrentChapter(
                            data?.OnboardingProgram?.ProgramSection?.[
                              index - 1
                            ],
                          );
                        } else {
                          setCurrentChapter(
                            data?.OnboardingProgram?.ProgramSection[0],
                          );
                        }
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
                          // set viewed the last one
                          addChapterToDone(
                            data?.OnboardingProgram?.ProgramSection?.[index]
                              ?.id as string,
                          );
                          if (
                            data?.OnboardingProgram?.QuizQuestion?.length === 0
                          ) {
                            recordCourseCompleted();
                          } else {
                            // check if already done with quiz
                            if (enrollmentStatus?.data.quizCompleted) {
                              setChaptersDone(true);
                              setCurrentQuestion(
                                data?.OnboardingProgram?.QuizQuestion?.[0],
                              );
                              setQuizDone(true);
                            } else {
                              setCurrentQuestion(
                                data?.OnboardingProgram?.QuizQuestion?.[0],
                              );
                              setChaptersDone(true);
                            }
                          }

                          return;
                        }
                        // set viewed the last one
                        addChapterToDone(
                          data?.OnboardingProgram?.ProgramSection?.[index]
                            ?.id as string,
                        );
                        // set current chapter to next chapter
                        setCurrentChapter(
                          data?.OnboardingProgram?.ProgramSection?.[index + 1],
                        );
                        recordViewChapter(
                          data?.OnboardingProgram?.ProgramSection?.[index + 1]
                            ?.id as string,
                        );
                      }}
                      disabled={isLoading}
                      className="h-max w-max rounded-[5px] bg-secondary px-8 py-2 text-[14px] font-semibold text-white disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
              {!courseDone && (
                <div className="z-50 hidden h-auto w-full flex-col gap-8 rounded-br-md rounded-tr-md border-l-[1px] border-gray-300 bg-gray-100 p-4 px-0 md:fixed md:bottom-5 md:right-4 md:top-[95px] md:flex md:w-[350px]">
                  <div className="flex flex-col gap-6 px-4 text-tertiary">
                    <h2 className="text-lg font-semibold">About the Course</h2>
                    <div className="flex w-full flex-col items-start gap-3">
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
                      <div className="flex items-center gap-2 px-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6 text-gray-500"
                        >
                          <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                          <path
                            fillRule="evenodd"
                            d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">
                          Created on {processDate(data.createdAt)}
                        </span>
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
                              ((completeChapters?.length + (quizDone ? 1 : 0)) /
                                (data.OnboardingProgram.ProgramSection?.length +
                                  (data?.OnboardingProgram?.QuizQuestion
                                    ?.length > 0
                                    ? 1
                                    : 0))) *
                              100
                            ).toFixed(0)}
                            % Completed
                          </span>
                          <span>
                            {completeChapters?.length + (quizDone ? 1 : 0)}/
                            {data.OnboardingProgram.ProgramSection?.length +
                              (data?.OnboardingProgram?.QuizQuestion?.length > 0
                                ? 1
                                : 0)}
                          </span>
                        </div>
                        <div className="flex w-full flex-col gap-6">
                          <div className="flex w-full gap-2">
                            {[
                              ...Array(
                                data.OnboardingProgram.ProgramSection?.length +
                                  (data?.OnboardingProgram?.QuizQuestion
                                    ?.length > 0
                                    ? 1
                                    : 0),
                              ),
                            ].map((_, i) => (
                              <div
                                key={i}
                                style={{
                                  width: `${
                                    ((completeChapters?.length +
                                      (quizDone ? 1 : 0)) /
                                      data.OnboardingProgram.ProgramSection
                                        ?.length +
                                      (data?.OnboardingProgram?.QuizQuestion
                                        ?.length > 0
                                        ? 1
                                        : 0)) *
                                    100
                                  }%`,
                                }}
                                className={`h-2 rounded-3xl ${
                                  i <
                                  completeChapters?.length + (quizDone ? 1 : 0)
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
                                  done={
                                    completeChapters?.includes(section.id) ??
                                    false
                                  }
                                />
                              ),
                            )}
                            {data?.OnboardingProgram?.QuizQuestion?.length >
                              0 && (
                              <div className="flex w-full items-center justify-around rounded-lg bg-gray-200 p-2 py-3 font-medium text-tertiary">
                                <span className="w-max font-semibold">
                                  0
                                  {data?.OnboardingProgram?.ProgramSection
                                    ?.length + 1}
                                </span>
                                <p
                                  className={`w-[75%] text-sm ${
                                    quizDone
                                      ? "text-gray-500 line-through"
                                      : "text-tertiary"
                                  }`}
                                >
                                  Course Quiz
                                </p>
                                {quizDone ? (
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
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
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
            </>
          )}
          {!enrollmentStatus?.data && (
            <div className="h-full w-full">
              <div className="flex h-full w-[calc(100%_-_350px)] flex-col gap-8">
                <div className="h-10 w-4/5 animate-pulse bg-gray-400"></div>
                <div className="flex h-[400px] w-full animate-pulse items-center justify-center bg-gray-300">
                  <svg
                    className="h-12 w-12 text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                  >
                    <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"></path>
                  </svg>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <div className="mb-2 h-5 w-[200px] animate-pulse bg-gray-400"></div>
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                </div>

                <div className="flex w-[600px] flex-col gap-2">
                  <div className="mb-2 h-5 w-[200px] animate-pulse bg-gray-400"></div>
                  <div className="h-12 w-full animate-pulse rounded-md bg-gray-300"></div>
                  <div className="h-12 w-full animate-pulse rounded-md bg-gray-300"></div>
                  <div className="h-12 w-full animate-pulse rounded-md bg-gray-300"></div>
                </div>
                <div className="h-10 w-[200px] animate-pulse rounded-xl bg-gray-300"></div>
              </div>
              <div className="fixed bottom-5 right-4 top-[95px] z-50 flex h-auto w-[350px] flex-col gap-8 rounded-br-md rounded-tr-md border-l-[1px] border-gray-300 bg-gray-100 p-4 px-4">
                <div className="mb-2 h-8 w-full animate-pulse rounded-md bg-gray-400"></div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-gray-400"></div>
                  <div className="flex w-4/5 flex-col gap-0">
                    <div className="mb-2 h-6 w-full animate-pulse rounded-md bg-gray-400"></div>
                    <div className="mb-2 h-4 w-full animate-pulse rounded-md bg-gray-400"></div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                  <div className="h-3 w-4/5 animate-pulse bg-gray-300"></div>
                </div>
              </div>
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
