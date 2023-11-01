/* eslint-disable @next/next/no-img-element */
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  ProgramSection,
  User,
} from "@prisma/client";
import React from "react";

import { motion } from "framer-motion";
import { useGetEnrollmentStatusQuery } from "services/baseApiSlice";
import { CompletionStatus } from "./talents.table";

export interface IEnrollment extends OnboardingProgramTalents {
  OnboardingProgram: OnboardingProgram & {
    ProgramSection: ProgramSection[];
  };
}

export default function MyEnrolledPrograms({
  data,
  user,
  setShowTalentEnrolModal,
  unenroll,
}: {
  data: IEnrollment[];
  user: User;
  setShowTalentEnrolModal?: (arg: [string, string]) => void;
  unenroll: (arg: string) => void;
}) {
  console.log("data", data);

  if (!data) return null;

  return (
    <section className="w-[95%]">
      <div className="relative mt-[20px] flex h-full flex-col items-center justify-center gap-8">
        {data?.length === 0 && (
          <div
            className={`mr-auto flex flex-col items-center justify-center gap-4 md:min-h-[400px] ${
              user ? "w-full" : "w-full md:w-1/2"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#9d2a57"
              className="h-8 w-8"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
            {user ? (
              <div className="flex flex-col gap-2">
                <p>
                  <span className="capitalize">{user?.name}</span> has not been
                  enrolled to any course
                </p>
                <button
                  onClick={() =>
                    setShowTalentEnrolModal &&
                    setShowTalentEnrolModal([user?.id, user?.name as string])
                  }
                  className="mx-auto mb-2 mt-2 block w-max whitespace-nowrap rounded-xl bg-tertiary px-12 py-2 text-sm font-semibold text-white"
                >
                  Enroll Now
                </button>
              </div>
            ) : (
              <p className="text-center leading-[150%]">
                You have not been enrolled yet to any course.{" "}
                <br className="hidden md:block" />
                You will receive an email when enrolled to a course.
              </p>
            )}
          </div>
        )}
        {data?.length > 0 && (
          <div className="flex w-full flex-wrap gap-8">
            {data?.map((program: IEnrollment, i: number) => (
              <OneProgramCard
                key={program.id}
                program={program}
                delay={i * 0.1}
                fromAdmin={!!user}
                user={user}
                unenroll={unenroll}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function OneProgramCard({
  program,
  delay,
  unenroll,
  user,
}: {
  program: IEnrollment;
  delay: number;
  fromAdmin?: boolean;
  unenroll: (arg: string) => void;
  user: User;
}) {
  const body = {
    programId: program?.programId,
  };
  const { data: enrollmentStatus } = useGetEnrollmentStatusQuery(body, {
    skip: !program,
  });
  console.log(
    "length",
    program?.OnboardingProgram?.ProgramSection?.length,
    "course",
    program?.OnboardingProgram?.name,
    "status",
    enrollmentStatus?.data,
  );
  return (
    <motion.div
      initial={{ y: 15 }}
      transition={{ duration: 0.3, ease: "easeIn", delay }}
      whileInView={{ y: 0 }}
      className="w-full"
      viewport={{ once: true }}
    >
      <div className="relative flex w-full flex-col items-center gap-4 rounded-lg border-[1px] border-[#964f70] bg-white text-tertiary md:flex-row md:pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#964f70"
          className="hidden h-16 w-16 md:block"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>

        <div
          className={`relative flex w-full flex-col items-start justify-start gap-1 rounded-t-lg p-4 text-tertiary`}
        >
          <h2 className="text-lg font-bold leading-tight">
            {program?.OnboardingProgram?.name}
          </h2>
          <div
            className={`flex h-max w-full max-w-[400px] items-center gap-2 rounded-lg px-4 py-2 pl-0`}
          >
            <CompletionStatus
              enrollment={{
                userId: user?.id,
              }}
              fromViewTalent={program?.programId}
              totalChapters={
                program?.OnboardingProgram?.ProgramSection?.length ?? 0
              }
            />
          </div>
        </div>

        <button
          onClick={() => unenroll(program.id)}
          className="mr-3 flex w-[150px] items-center justify-center gap-2 rounded-md border-[1px] border-tertiary bg-white px-4 py-1 text-sm font-semibold text-tertiary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
          <span className="w-max">Unenroll</span>
        </button>
      </div>
    </motion.div>
  );
}
