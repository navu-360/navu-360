/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProgramSection, User } from "@prisma/client";
import { DeleteConfirmModal } from "components/dashboard/confirmDeleteProgram";
import ChapterCard from "components/library/chapterCardView";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { OneProgramCard } from "pages/programs";
import { CompletionStatus } from "pages/talents";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "redux/common/commonSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

export default function SearchResults() {
  const resultsCourses = useSelector(
    (state: any) => state.common.resultsCourses,
  );
  const resultsTalents: User[] = useSelector(
    (state: any) => state.common.resultsTalents,
  );
  const resultsChapters: ProgramSection[] = useSelector(
    (state: any) => state.common.resultsChapters,
  );
  const searchQuery: string = useSelector(
    (state: any) => state.common.searchQuery,
  );

  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState<
    boolean | string
  >(false);

  const router = useRouter();

  const dispatch = useDispatch();

  return (
    <section className="relative ml-[90px] mr-4 mt-[2rem] flex w-auto flex-col justify-between gap-8 text-tertiary md:ml-[230px]">
      {resultsCourses?.length === 0 &&
      resultsTalents?.length === 0 &&
      resultsChapters?.length === 0 ? (
        <div className="mt-32 flex flex-col">
          <p className="text-center text-2xl font-semibold">
            No results found for &quot;{searchQuery}&quot;
          </p>
          <p className="text-center text-lg">
            Please try a different search term
          </p>
          <button
            onClick={() => {
              dispatch(setSearchQuery(""));
            }}
            className="text-sm font-medium text-blue-500 underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-8">
          {resultsCourses?.length > 0 && (
            <div className="flex w-full flex-col gap-4">
              <h2>Found Courses({resultsCourses?.length})</h2>
              <div className="flex flex-wrap gap-4">
                {resultsCourses?.map((course: any, i: number) => (
                  <OneProgramCard
                    program={course}
                    key={course.id}
                    delay={i * 0.05}
                    deleteProgram={(id) => setShowDeleteProgramModal(id)}
                  />
                ))}
              </div>
            </div>
          )}
          {resultsTalents?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2>Found Talents({resultsTalents?.length})</h2>
              <div className="flex flex-wrap">
                <table className="w-full max-w-[100%] border-collapse items-center overflow-x-auto bg-transparent">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Talent
                      </th>
                      <th className="role whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Role
                      </th>
                      <th className="date whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Enrolled
                      </th>

                      <th className="progress whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Completion{" "}
                      </th>

                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {resultsTalents?.map((talent: any) => (
                      <tr
                        key={talent?.id}
                        className="border border-secondary/25 hover:bg-secondary/10"
                      >
                        <td className="relative flex flex-col gap-3 whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left text-xs md:flex-row md:items-center md:gap-0">
                          <img
                            src={generateAvatar(
                              talent?.User?.name ?? talent?.name,
                            )}
                            className="h-12 w-12 rounded-full"
                            alt={talent?.User?.name ?? talent?.name}
                          />
                          <span className="ml-3 font-bold capitalize">
                            {talent?.User?.name ?? talent?.name}
                          </span>
                        </td>
                        <td className="role whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                          {talent?.User?.position ?? talent?.position}
                        </td>
                        <td className="date whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                          {processDate(talent?.createdAt)}
                        </td>
                        <CompletionStatus enrollment={talent} />

                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs">
                          <div
                            className="min-w-48 z-50 list-none rounded py-2 text-left text-base"
                            id="table-dark-1-dropdown"
                          >
                            <Link
                              href={`/talents/${talent?.User?.id}`}
                              className="text-blueGray-700 mb-2 block w-max rounded-xl border-[1px] border-secondary/50 bg-white px-4 py-2 text-sm font-semibold text-secondary transition-all duration-150 ease-in hover:bg-secondary hover:text-white md:px-12"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {resultsChapters?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2>Found Library Chapters({resultsChapters?.length})</h2>
              <div className="grid grid-cols-4 flex-wrap">
                {resultsChapters?.map(
                  (block: ProgramSection, index: number) => (
                    <ChapterCard
                      key={block.id}
                      delay={index * 0.1}
                      name={block.name as string}
                      created={block.createdAt}
                      updated={block.updatedAt}
                      view={() => {
                        console.log("view");
                        router.push(
                          `/library?view=${block.type}&id=${block.id}`,
                        );
                      }}
                    />
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showDeleteProgramModal && (
          <DeleteConfirmModal
            id={showDeleteProgramModal as string}
            setShowConfirmModal={() => setShowDeleteProgramModal(false)}
            refreshPrograms={() => {
              setShowDeleteProgramModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
