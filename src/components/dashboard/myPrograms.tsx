/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgramTalents } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

import { motion } from "framer-motion";

export default function MyEnrolledPrograms({
  data,
}: {
  data: OnboardingProgramTalents[];
}) {
  return (
    <section className="w-[75%]">
      <div className="relative mt-[20px] flex h-full flex-col items-center justify-center gap-8">
        {data?.length === 0 && (
          <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FB5881"
              className="h-8 w-8"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-center leading-[150%]">
              You have not been enrolled yet to any program <br />
              You will receive an email when enrolled
            </p>
          </div>
        )}
        {data?.length > 0 && (
          <div className="flex w-full flex-wrap gap-8">
            {data?.map((program: OnboardingProgramTalents, i: number) => (
              <OneProgramCard
                key={program.id}
                program={program}
                delay={i * 0.05}
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
}: {
  program: OnboardingProgramTalents;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 10 }}
      transition={{ duration: 0.3, ease: "easeIn", delay }}
      whileInView={{ y: 0 }}
    >
      <Link
        href={`/learn/${program.id}`}
        onClick={(e) => {
          // if click element IDs: editProgram, deleteProgram, cancel default
          if (e.target) {
            if (
              (e.target as HTMLElement).id === "delete1" ||
              (e.target as HTMLElement).id === "delete2" ||
              (e.target as HTMLElement).id === "delete3" ||
              (e.target as HTMLElement).id === "delete4" ||
              (e.target as HTMLElement).id === "delete5" ||
              (e.target as HTMLElement).id === "delete6" ||
              (e.target as HTMLElement).id === "delete7"
            ) {
              e.preventDefault();
            }
          }
        }}
        className="relative flex h-[280px] w-[300px] flex-col gap-4 rounded-lg bg-white text-tertiary shadow-md"
      >
        <div className="relative flex h-[60px] w-full items-center gap-2 rounded-t-lg bg-tertiary p-4 text-white">
          <h2 className="text-lg font-bold">{program.id}</h2>
        </div>

        <div className="-mt-2 flex items-center gap-2 px-4">
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
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <p>Complete</p>
        </div>
      </Link>
    </motion.div>
  );
}
