/* eslint-disable @next/next/no-img-element */
import type { User } from "@prisma/client";
import Header from "components/common/head";
import Spinner from "components/common/spinner";
import { CompletionStatus } from "components/dashboard/talents.table";
import DashboardWrapper from "components/layout/dashboardWrapper";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useFetchUsersQuery } from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

export default function Talents() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const { data, isFetching } = useFetchUsersQuery(orgId, { skip: !orgId });

  if (isFetching)
    return (
      <>
        <Header title="All Talents - Loading ..." />
        <DashboardWrapper hideSearch>
          <div className="relative ml-[300px] mt-[20px] flex h-full flex-col items-center justify-center gap-8">
            <div className="flex w-full flex-wrap gap-8">
              <div className="flex min-h-[70vh] w-full items-center justify-center">
                <Spinner />
              </div>
            </div>
          </div>
        </DashboardWrapper>
      </>
    );

  return (
    <>
      <Header title={`All Talents - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[250px] mt-[20px] flex h-full flex-col items-center justify-center gap-8 2xl:ml-[250px]">
          <table className="mt-8 w-auto min-w-[80vw] border-collapse items-center border bg-tertiary text-white">
            <thead>
              <tr>
                <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                  Talent
                </th>
                <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                  Role
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
              {data?.data?.length === 0 && (
                <tr>
                  <td
                    align="center"
                    colSpan={6}
                    className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-lg font-bold"
                  >
                    No talents have been enrolled yet
                  </td>
                </tr>
              )}
              {data?.data?.length > 0 &&
                data?.data?.map((talent: User) => (
                  <tr key={talent?.id} className="border border-secondary/25">
                    <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                      <img
                        src={generateAvatar(talent?.id)}
                        className="h-12 w-12 rounded-full border bg-white"
                        alt={talent?.id}
                      />
                      <span className="ml-3 font-bold text-white">
                        {talent?.name}
                      </span>
                    </th>
                    <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-sm font-semibold">
                      {talent?.position}
                    </td>
                    <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-sm font-semibold">
                      {processDate(talent?.createdAt)}
                    </td>
                    <CompletionStatus enrollment={{ userId: talent?.id }} />
                    <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs">
                      <div
                        className="min-w-48 z-50 list-none rounded py-2 text-left text-base"
                        id="table-dark-1-dropdown"
                      >
                        <Link
                          href={`/talents/${talent?.id}`}
                          className="mb-2 block w-max whitespace-nowrap rounded-xl bg-white px-12 py-2 text-sm font-semibold text-tertiary"
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
      </DashboardWrapper>
    </>
  );
}
