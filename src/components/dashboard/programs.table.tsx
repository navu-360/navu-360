/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useSelector } from "react-redux";
import { useGetOrganizationProgramsQuery } from "services/baseApiSlice";

export default function Programs({
  showSelectTemplate,
}: {
  showSelectTemplate: () => void;
}) {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );
  const { data, isFetching } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section className="w-[25%]">
      <section className="bg-blueGray-50 relative py-16">
        <div className="mb-12 w-full px-4">
          <div
            className="relative mb-6 flex h-max w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
          >
            {data?.data?.length > 0 && (
              <div className="mb-0 rounded-t border-0 px-4 py-3">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                    <h3 className="text-lg font-semibold text-white">
                      All Programs
                    </h3>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-3 flex h-[calc(100vh_-_450px)] flex-col items-center gap-4 overflow-y-auto pb-8">
              {(isFetching || !orgId) && (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="h-[200px] w-4/5 animate-pulse rounded bg-gray-400" />
                  <div className="h-[200px] w-4/5  animate-pulse rounded bg-gray-400" />
                  <div className="h-[200px] w-4/5  animate-pulse rounded bg-gray-400" />
                </div>
              )}
              {!isFetching && orgId && data?.data?.length === 0 && (
                <div className="relative top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    No Programs Found
                  </h3>
                  <button
                    onClick={() => showSelectTemplate()}
                    className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
                  >
                    Create Program
                  </button>
                </div>
              )}
              {data?.data?.map(
                (program: { name: string; id: string; content: string }) => (
                  <div
                    key={program.id}
                    className="relative flex h-[200px] min-h-[200px] w-4/5 flex-col rounded-3xl bg-white"
                  >
                    <div>
                      <h3 className="mt-2 text-center font-bold text-tertiary">
                        {program?.name}
                      </h3>
                    </div>
                    <div className="absolute left-2 bottom-2 flex">
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-1-800x800.jpg"
                        alt="..."
                        className="border-blueGray-50 h-10 w-10 rounded-full border-2 shadow"
                      />
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                        alt="..."
                        className="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
                      />
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-3-800x800.jpg"
                        alt="..."
                        className="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
                      />
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-4-470x470.png"
                        alt="..."
                        className="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
                      />
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-4-470x470.png"
                        alt="..."
                        className="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
                      />
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-4-470x470.png"
                        alt="..."
                        className="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
                      />
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-4-470x470.png"
                        alt="..."
                        className="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
