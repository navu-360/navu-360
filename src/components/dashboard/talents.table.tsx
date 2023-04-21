/* eslint-disable @next/next/no-img-element */
import Spinner from "components/common/spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllTalentsQuery } from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

import { useGetSentInvitesQuery } from "services/baseApiSlice";
import { TalentSwitch } from "./common";
import type { User } from "@prisma/client";

export default function AllTalents({
  sendTotalTalents,
}: {
  sendTotalTalents: (count: number) => void;
}) {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const { data, isFetching } = useGetAllTalentsQuery(orgId, {
    skip: !orgId,
  });

  const id = orgId;

  const { data: sentInvites, isFetching: fetchingInvited } =
    useGetSentInvitesQuery(id, {
      skip: !id,
    });

  useEffect(() => {
    sendTotalTalents(data?.data?.length || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data?.length]);

  const [showingTalents, setShowingTalents] = useState([]);

  const [selectedType, setSelectedType] = useState("Enrolled");

  useEffect(() => {
    selectedType === "Enrolled"
      ? setShowingTalents(data?.data ?? [])
      : setShowingTalents(sentInvites?.data ?? []);
  }, [data?.data, selectedType, sentInvites?.data]);

  if (isFetching || fetchingInvited || !orgId)
    return (
      <section className="w-[75%] rounded-md border-[1px] border-tertiary/50 bg-tertiary/10 p-2">
        <section className="bg-blueGray-50 relative py-16">
          <TalentSwitch
            selectedOption={selectedType}
            setSelectedOption={setSelectedType}
          />
          <div className="mb-12 w-full">
            <div
              className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
            >
              <div className="mb-0 rounded-t border-0 px-4 py-3">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedType} Talents
                    </h3>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto ">
                <table className="w-full border-collapse items-center bg-transparent">
                  <thead>
                    {selectedType === "Enrolled" ? (
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
                          Type
                        </th>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Actions
                        </th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Talent
                        </th>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Invite Date
                        </th>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Type
                        </th>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Actions
                        </th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        align="center"
                        colSpan={selectedType === "Enrolled" ? 6 : 4}
                        className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
                      >
                        <Spinner smaller />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </section>
    );

  return (
    <section className="w-[75%] rounded-md border-[1px] border-tertiary/50 bg-tertiary/5 p-2">
      <section className="relative py-16">
        <TalentSwitch
          selectedOption={selectedType}
          setSelectedOption={setSelectedType}
        />
        <div className="mb-12 w-full">
          <div
            className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
          >
            <div className="mb-0 rounded-t border-0 px-4 py-3">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedType} talents
                  </h3>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto ">
              <table className="w-full border-collapse items-center bg-transparent">
                <thead>
                  {selectedType === "Enrolled" ? (
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
                  ) : (
                    <tr>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Talent
                      </th>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Invite Date
                      </th>
                      <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                        Actions
                      </th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {/* enrolled */}
                  {showingTalents?.length === 0 && (
                    <tr>
                      <td
                        align="center"
                        colSpan={selectedType === "Enrolled" ? 6 : 4}
                        className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-lg font-bold"
                      >
                        No talents have been {selectedType.toLowerCase()} yet
                      </td>
                    </tr>
                  )}
                  {showingTalents?.length > 0 &&
                    showingTalents?.map((talent: User) =>
                      selectedType === "Enrolled" ? (
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
                          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                            {talent?.role}
                          </td>
                          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
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
                              className="min-w-48 z-50 list-none rounded py-2 text-left text-base"
                              id="table-dark-1-dropdown"
                            >
                              <Link
                                href={`/talents/${talent?.id}`}
                                className="text-blueGray-700 mb-2 block w-max whitespace-nowrap rounded-xl bg-white px-12 py-2 text-sm font-semibold text-secondary"
                              >
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={talent?.id}>
                          <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                            <img
                              src={generateAvatar(talent?.id)}
                              className="h-12 w-12 rounded-full border bg-white"
                              alt={talent?.email as string}
                            />
                            <span className="ml-3 font-bold text-white">
                              {talent?.email}
                            </span>
                          </th>
                          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                            {processDate(talent?.createdAt)}
                          </td>

                          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs">
                            <div
                              className="min-w-48 z-50 list-none rounded text-left text-base"
                              id="table-dark-1-dropdown"
                            >
                              <button className="text-blueGray-700 flex w-max items-center gap-2 whitespace-nowrap rounded-xl bg-secondary px-8 py-2 text-sm font-semibold text-white">
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Revoke Invite
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
