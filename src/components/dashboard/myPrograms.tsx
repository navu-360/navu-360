/* eslint-disable @next/next/no-img-element */
import type { User } from "@prisma/client";
import Spinner from "components/common/spinner";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useGetAllTalentsQuery } from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

export default function MyEnrolledPrograms() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const { data, isFetching } = useGetAllTalentsQuery(orgId, {
    skip: !orgId,
  });

  if (isFetching || !orgId)
    return (
      <section className="w-[75%]">
        <section className="bg-blueGray-50 relative py-16">
          <div className="mb-12 w-full">
            <div
              className="table-shadow relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
            >
              <div className="mb-0 rounded-t border-0 px-4 py-3">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                    <h3 className="text-lg font-semibold text-white">
                      My enrolled programs
                    </h3>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto ">
                <table className="w-full border-collapse items-center bg-transparent">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Name
                      </th>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Started
                      </th>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Joined
                      </th>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Completion{" "}
                      </th>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {isFetching && (
                      <tr>
                        <td
                          align="center"
                          colSpan={5}
                          className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
                        >
                          <Spinner smaller />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </section>
    );

  return (
    <section className="w-[75%]">
      <section className="bg-blueGray-50 relative py-16">
        <div className="mb-12 w-full">
          <div
            className="table-shadow relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
          >
            <div className="mb-0 rounded-t border-0 px-4 py-3">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                  <h3 className="text-lg font-semibold text-white">
                    My enrolled programs
                  </h3>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto ">
              <table className="w-full border-collapse items-center bg-transparent">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Name
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Started
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Joined
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Completion{" "}
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isFetching && (
                    <tr>
                      <td
                        align="center"
                        colSpan={5}
                        className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
                      >
                        <Spinner smaller />
                      </td>
                    </tr>
                  )}
                  {data?.data?.length === 0 && !isFetching && (
                    <tr>
                      <td
                        align="center"
                        colSpan={5}
                        className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-lg font-bold"
                      >
                        No talents have been invited yet
                      </td>
                    </tr>
                  )}
                  {!isFetching &&
                    data?.data?.length > 0 &&
                    data?.data?.map((talent: User) => (
                      <tr key={talent?.id}>
                        <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                          <img
                            src={generateAvatar(talent?.id)}
                            className="h-12 w-12 rounded-full border bg-white"
                            alt="..."
                          />
                          <span className="ml-3 font-bold text-white">
                            {talent?.name}
                          </span>
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-medium">
                          {talent?.role}
                        </td>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-medium">
                          {processDate(talent?.createdAt)}
                        </td>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                          <div className="flex items-center">
                            <span className="mr-2 font-semibold">60%</span>
                            <div className="relative w-full">
                              <div className="flex h-2 overflow-hidden rounded bg-red-200 text-xs">
                                <div className="flex w-[60%] flex-col justify-center whitespace-nowrap bg-red-500 text-center text-white shadow-none"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs">
                          <div
                            className="min-w-48 z-50 list-none rounded py-2 text-left text-base shadow-lg"
                            id="table-dark-1-dropdown"
                          >
                            <Link
                              href={`/talents/${talent?.id}`}
                              className="text-blueGray-700 mb-2 block w-max whitespace-nowrap rounded-xl bg-white px-8 py-2 text-sm font-semibold text-secondary"
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
        </div>
      </section>
    </section>
  );
}
