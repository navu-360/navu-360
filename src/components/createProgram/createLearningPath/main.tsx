import type { OnboardingProgram } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrganizationProgramsQuery,
  useCreateLearningPathMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";

export default function CreateLearningPath({ closeModal }: { closeModal: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  const { data: programs } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
    refetchOnMountOrArgChange: true,
  });

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const [createPath, { isLoading }] = useCreateLearningPathMutation();

  const createPathHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    //
    const body = {
      name,
      description,
      courseIds: selectedCourses,
    };

    createPath(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Learning Path Created Successfully",
        });
        closeModal();
      })
      .catch((err) => {
        toaster({
          status: "error",
          message: err?.message ?? "Error Creating Learning Path",
        });
      });
  };

  return (
    <div
      onClick={(e) => (e.currentTarget === e.target ? closeModal() : null)}
      className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-dark/30 backdrop-blur-sm"
    >
      <div className="relative h-[80vh] min-h-[600px] w-[1000px] overflow-hidden rounded-lg bg-white p-4 px-8">
        <div
          onClick={() => closeModal()}
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
        <form className="no-scrollbar mt-8 flex h-full w-full flex-col gap-12 overflow-y-auto">
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
            <div className="mt-2 grid h-full flex-1 grid-cols-5 gap-4 overflow-y-auto pb-32">
              {programs?.data?.map((course: OnboardingProgram) => (
                <CourseCard
                  course={course}
                  key={course?.id}
                  isSelected={selectedCourses.includes(course?.id)}
                  toggleCourse={() => {
                    if (selectedCourses.includes(course?.id)) {
                      setSelectedCourses(
                        selectedCourses.filter((id) => id !== course?.id),
                      );
                    } else {
                      setSelectedCourses([...selectedCourses, course?.id]);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        </form>

        <div className="absolute inset-x-0 bottom-0 z-20 flex w-full flex-row-reverse items-center justify-between gap-2 bg-white px-8 py-4 md:gap-8">
          <button
            disabled={
              name.length === 0 ||
              description.length === 0 ||
              selectedCourses.length === 0 ||
              isLoading
            }
            type="submit"
            onClick={(e) => createPathHandler(e)}
            className="h-max w-max rounded-md bg-secondary px-8 py-1.5 text-sm font-semibold text-white"
          >
            Create Learning Path
          </button>
          <button
            onClick={() => {
              console.log("cancel");
              closeModal();
            }}
            className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  isSelected,
  toggleCourse,
}: {
  course: OnboardingProgram;
  isSelected: boolean;
  toggleCourse: () => void;
}) {
  return (
    <div
      onClick={() => toggleCourse()}
      className="shadowAroundFeature relative h-[150px] w-full rounded-md bg-white"
    >
      {isSelected ? (
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
          className="lucide lucide-check-circle-2 absolute right-2 top-2 z-20 text-green-500"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ) : (
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
          className="lucide lucide-circle absolute right-2 top-2 z-20 text-gray-300"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      )}
      <div className="relative z-10 h-full w-full rounded-md">
        <Image
          src={course?.image ?? ""}
          alt={course?.name}
          fill
          className="h-full w-full rounded-md object-cover"
        />
      </div>
      <div className="overlay-dark absolute inset-x-0 bottom-0 z-[15] flex h-full items-end !rounded-md pb-2 text-white">
        <h4 className="px-2 text-sm font-semibold text-white">
          {course?.name}
        </h4>
      </div>
    </div>
  );
}
