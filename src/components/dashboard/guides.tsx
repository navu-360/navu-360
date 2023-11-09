import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";
import Pricing from "components/landing/pricing";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import type { Organization } from "@prisma/client";

export function NoCourses({
  showSelectTemplate,
}: {
  showSelectTemplate: () => void;
}) {
  return (
    <motion.section
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3 }}
      className="m-auto flex max-w-4xl flex-col justify-center gap-6 rounded-3xl bg-gray-200 p-4 px-8 text-center"
    >
      <Image
        src={"/ebook.svg"}
        alt="Create a new Course"
        height={120}
        width={120}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold text-tertiary">
        Create Your First Course
      </h2>
      <p className="mx-auto max-w-[75%] text-base font-medium text-gray-500">
        Create a new course using our intuitive course creator. You can create
        chapters fortext, images, videos, and documents.
      </p>
      <button
        onClick={() => showSelectTemplate()}
        className="z-50 mx-auto flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-[#651b38] focus:outline-none focus:ring-4"
      >
        <span>Continue</span>
      </button>
    </motion.section>
  );
}

export function WelcomeGuide({
  awesome,
  loading,
}: {
  awesome: () => void;
  loading: boolean;
}) {
  const { data: session } = useSession();
  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData,
  );
  return (
    <motion.section
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3 }}
      className="m-auto flex max-w-4xl flex-col justify-center gap-6 rounded-3xl bg-gray-200 p-4 px-8 text-center"
    >
      <Image
        src={"/ebook.svg"}
        alt="Create a new Course"
        height={120}
        width={120}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold text-tertiary">Welcome to Navu360!</h2>
      <p className="mx-auto max-w-[75%] text-base font-medium text-gray-500">
        Hi {session?.user?.name} 👋 <br />
        We&apos;re excited to have you onboard Navu360, a platform committed to
        redefining the way talent is trained in {organizationData?.name}. <br />
        <br />
        You&apos;re currently using our generous free plan. You can upgrade to a
        paid plan at any time. <br />
      </p>
      <button
        disabled={loading}
        onClick={() => awesome()}
        className="z-50 mx-auto flex h-max min-h-[45px] w-max min-w-[200px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-[#651b38] focus:outline-none focus:ring-4"
      >
        <span>Continue</span>
      </button>
    </motion.section>
  );
}

export function NoAssignedCourses() {
  const { data: session } = useSession();
  return (
    <motion.section
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3 }}
      className="m-auto mt-32 flex max-w-4xl flex-col justify-center gap-6 rounded-3xl bg-gray-200 p-4 px-8 text-center"
    >
      <Image
        src={"/ebook.svg"}
        alt="Create a new Course"
        height={120}
        width={120}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold text-tertiary">
        No Assigned Courses Yet
      </h2>
      <p className="mx-auto max-w-[75%] text-base font-medium text-gray-500">
        Hi {session?.user?.name} 👋 <br />
        Welcome to Navu360. There are no assigned courses for you at this time.
        Once a course is assigned to you, you will receive an email.
      </p>
    </motion.section>
  );
}

export function NoLibraryItems({
  orgName,
  createChapter,
}: {
  orgName: string;
  createChapter: () => void;
}) {
  return (
    <motion.section
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3 }}
      className="m-auto flex max-w-4xl flex-col justify-center gap-6 rounded-3xl bg-gray-200 p-4 px-8 text-center"
    >
      <Image
        src={"/library.svg"}
        alt="Create a new Course"
        height={120}
        width={120}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold text-tertiary">
        {orgName}&apos;s Library
      </h2>
      <p className="mx-auto max-w-[75%] text-base font-medium text-gray-500">
        Welcome to {orgName}&apos;s Library. The library serves as a repository
        for chapters that can be used to create courses. Create as many chapters
        as you want. <br /> <br /> While creating a course, you can select
        chapters from the library to add to the course.
      </p>
      <button
        onClick={() => createChapter()}
        className="z-50 mx-auto flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-[#651b38] focus:outline-none focus:ring-4"
      >
        <span>Create First Chapter</span>
      </button>
    </motion.section>
  );
}

export function NoInvitedTalents({
  showInviteModal,
  coursesCount,
  orgName,
}: {
  showInviteModal: () => void;
  coursesCount: number;
  orgName: string;
}) {
  return (
    <motion.section
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3 }}
      className="m-auto flex h-max max-w-4xl flex-col justify-center gap-6 rounded-3xl bg-gray-200 p-4 px-8 text-center"
    >
      <Image
        src={"/employee.svg"}
        alt="Invite Talents"
        height={120}
        width={120}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold text-tertiary">Invite Talents</h2>
      <p className="mx-auto max-w-[75%] text-base font-medium text-gray-500">
        You have {coursesCount}{" "}
        {coursesCount > 1 || coursesCount === 0 ? "courses" : "course"}. Invite
        talents to {orgName} to enroll them in your courses.
      </p>
      <button
        onClick={() => showInviteModal()}
        className="z-50 mx-auto flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-[#651b38] focus:outline-none focus:ring-4"
      >
        <span>Continue</span>
      </button>
    </motion.section>
  );
}

export function GetPlan() {
  return (
    <motion.section
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3 }}
      className="m-auto flex h-max flex-col justify-center gap-0 rounded-3xl bg-gray-200 p-4 px-8 text-center"
    >
      <Image
        src={"/subscription.svg"}
        alt="Select a Plan to Continue"
        height={120}
        width={120}
        className="mx-auto"
      />
      <h2 className="text-2xl font-bold text-tertiary">
        Select a Plan to Continue
      </h2>
      <Pricing fromStart />
    </motion.section>
  );
}
