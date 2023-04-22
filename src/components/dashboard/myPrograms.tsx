/* eslint-disable @next/next/no-img-element */
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  User,
} from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";

import { motion } from "framer-motion";

import { AnimatePresence } from "framer-motion";
import { SelectPrograms } from "./selectPrograms";
import { useGetOrganizationProgramsQuery } from "services/baseApiSlice";
import { useSelector } from "react-redux";

interface IEnrollment extends OnboardingProgramTalents {
  OnboardingProgram: OnboardingProgram;
}

export default function MyEnrolledPrograms({
  data,
  user,
  refetch,
}: {
  data: IEnrollment[];
  user?: User;
  refetch?: () => void;
}) {
  const [showTalentEnrolModal, setShowTalentEnrolModal] = useState<string[]>(
    []
  );

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );
  // get programs created by this organization
  const { data: allPrograms } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
  });

  if (!data) return null;

  return (
    <section className="w-[95%]">
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
            {user ? (
              <div className="flex flex-col gap-2">
                <p>{user?.name} has not been enrolled to any program. </p>
                <button
                  onClick={() =>
                    setShowTalentEnrolModal([user?.id, user?.name as string])
                  }
                  className="text-blueGray-700 mb-2 block w-max whitespace-nowrap rounded-xl bg-white px-12 py-2 text-sm font-semibold text-secondary"
                >
                  Enroll Now
                </button>
              </div>
            ) : (
              <p className="text-center leading-[150%]">
                You have not been enrolled yet to any program <br />
                You will receive an email when enrolled
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
              />
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {showTalentEnrolModal?.length > 0 && (
          <SelectPrograms
            closeModal={(val) => {
              if (val) {
                refetch && refetch();
              }
              setShowTalentEnrolModal([]);
            }}
            talentId={showTalentEnrolModal[0] as string}
            talentName={showTalentEnrolModal[1] as string}
            programs={allPrograms}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export function OneProgramCard({
  program,
  delay,
  fromAdmin,
}: {
  program: IEnrollment;
  delay: number;
  fromAdmin?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 15 }}
      transition={{ duration: 0.3, ease: "easeIn", delay }}
      whileInView={{ y: 0 }}
      className="w-full"
      viewport={{ once: true }}
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
        className="relative flex items-center gap-4 rounded-lg border-[1px] border-[#964f70] bg-white pl-4 text-tertiary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#964f70"
          className="h-16 w-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>

        <div
          className={`relative flex w-full items-start gap-1 rounded-t-lg p-4 text-tertiary ${
            fromAdmin
              ? "flex-col justify-between xl:flex-row"
              : "flex-col justify-start"
          }`}
        >
          <h2 className="text-lg font-bold leading-tight">
            {program?.OnboardingProgram?.name}
          </h2>
          <div
            className={`flex h-max items-center gap-2 rounded-lg px-4 py-2 pl-0 ${
              program?.enrollmentStatus === "pending"
                ? "text-yellow-800"
                : "text-[#00b300]"
            }`}
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <p className={`text-lg font-semibold capitalize`}>
              {program?.enrollmentStatus}
            </p>
          </div>
        </div>

        {!fromAdmin && (
          <div className="mr-8 flex h-max w-max items-center gap-4 rounded-lg bg-green-600/25 px-6 py-2">
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
              className="lucide lucide-send"
            >
              <line x1="22" x2="11" y1="2" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <p className="text-lg font-semibold capitalize">View</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
