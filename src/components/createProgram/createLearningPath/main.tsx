import type { OnboardingProgram } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";

export default function CreateLearningPath({ close }: { close: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div
      onClick={(e) => (e.currentTarget === e.target ? close() : null)}
      className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-dark/30 backdrop-blur-sm"
    >
      <div className="relative h-[80vh] min-h-[600px] w-[1000px] rounded-lg bg-white p-4 px-8">
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
        <h2 className="text-xl font-semibold capitalize text-dark">
          Create Learning Path
        </h2>
        <form className="mt-8 flex h-full w-full flex-col gap-12 overflow-y-auto">
          <div className="relative flex flex-col gap-2">
            <label htmlFor="role">Path Name</label>
            <input
              type="text"
              name="role"
              id="role"
              maxLength={70}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required
              minLength={3}
              autoFocus
              placeholder="e.g Leadership Development Path"
              className="common-input program-create-form text-sm"
              required
            />
            <span className="absolute -bottom-6 left-0 text-sm font-medium text-gray-400">
              {name?.length}/70
            </span>
          </div>
          <div className="relative flex flex-col gap-2">
            <label htmlFor="role">Path Description</label>
            <textarea
              name="desc"
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              maxLength={200}
              className="common-input program-create-form !h-[100px] text-sm"
              placeholder="e.g This track focuses on building leadership skills, such as strategic thinking, decision-making, team management, and emotional intelligence"
            />
            <span className="absolute -bottom-6 left-0 text-sm font-medium text-gray-400">
              {description?.length}/200
            </span>
          </div>

          <section>
            <h3 className="text-base font-semibold text-tertiary">
              Choose Courses
            </h3>
            <div className="grid grid-cols-4">
              <CourseCard />
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: OnboardingProgram }) {
  return (
    <div className="relative h-[300px] w-[300px] rounded-lg bg-white">
      <Image
        src="https://res.cloudinary.com/dpnbddror/image/upload/v1678044671/Rectangle_417_1_1_pq5jum.png"
        alt={course?.name}
        fill
        className="rounded-lg"
      />
    </div>
  );
}
