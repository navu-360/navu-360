import Image from "next/image";
import React from "react";

export function NoCourses({
  showSelectTemplate,
}: {
  showSelectTemplate: () => void;
}) {
  return (
    <section className="m-auto flex flex-col justify-center gap-6 rounded-3xl bg-gray-200 p-4 px-8 text-center">
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
        Welcome to Navu360. You can easily create a new course from scratch or
        use one of our templates.
      </p>
      <button
        onClick={() => showSelectTemplate()}
        className="z-50 mx-auto flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-150 ease-in hover:bg-[#651b38] focus:outline-none focus:ring-4"
      >
        <span>Continue</span>
      </button>
    </section>
  );
}

export function NoInvitedTalents() {
  return <section></section>;
}

export function NoEnrollments() {
  return <section></section>;
}
