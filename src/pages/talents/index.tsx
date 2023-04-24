/* eslint-disable @next/next/no-img-element */
import type { User } from "@prisma/client";
import Header from "components/common/head";
import Spinner from "components/common/spinner";
import { CompletionStatus } from "components/dashboard/talents.table";
import DashboardWrapper from "components/layout/dashboardWrapper";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFetchUsersQuery } from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

export default function Talents() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  // get all talents for the org
  const { data, isFetching } = useFetchUsersQuery(orgId, { skip: !orgId });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

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
        <div className="relative ml-[60px] mt-[20px] flex h-full flex-col items-center justify-center gap-8 md:ml-[200px] 2xl:ml-[230px]">
          <table className="mt-8 min-w-[70vw] border-collapse items-center border bg-tertiary text-white md:w-auto md:min-w-[70vw] 2xl:min-w-[80vw]">
            <thead>
              <tr>
                <th className="whitespace-nowrap bg-[#52324c] px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                  Talent
                </th>
                <th className="role whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                  Role
                </th>
                <th className="date whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                  Joined
                </th>
                <th className="progress whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                  Completion{" "}
                </th>
                <th className="bg-[#52324c] py-3 text-left align-middle text-xs font-semibold uppercase text-white md:px-6">
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
                    <th className="flex flex-col gap-3 whitespace-nowrap  border-l-0 border-r-0 border-t-0 p-3 text-left text-xs md:flex-row md:items-center md:gap-0 md:px-6">
                      <img
                        src={generateAvatar(talent?.id)}
                        className="h-12 w-12 rounded-full border bg-white"
                        alt={talent?.id}
                      />
                      <span className="ml-0 font-bold capitalize text-white md:ml-3">
                        {talent?.name}
                      </span>
                    </th>
                    <td className="role whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-sm font-semibold">
                      {talent?.position}
                    </td>
                    <td className="date whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-sm font-semibold">
                      {processDate(talent?.createdAt)}
                    </td>
                    <CompletionStatus enrollment={{ userId: talent?.id }} />
                    <td className="border-l-0 border-r-0 border-t-0 px-0 text-right align-middle text-xs md:p-4 md:px-6">
                      <div
                        className="z-50 rounded py-2 text-left text-base"
                        id="table-dark-1-dropdown"
                      >
                        <Link
                          href={`/talents/${talent?.id}`}
                          className="mb-2 block w-max rounded-xl bg-white px-4 py-2 text-sm font-semibold text-tertiary md:px-12"
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
