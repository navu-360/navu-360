/* eslint-disable @next/next/no-img-element */
import Spinner from "components/common/spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetOrganizationEnrollmentsQuery,
  useGetTalentEnrollmentsQuery,
} from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

import DashboardWrapper from "components/layout/dashboardWrapper";

import { useGetSentInvitesQuery } from "services/baseApiSlice";
import type { OnboardingProgramTalents } from "@prisma/client";
import { AnimatePresence } from "framer-motion";

import { motion } from "framer-motion";
import { SelectPrograms } from "components/dashboard/selectPrograms";
import Header from "components/common/head";
import { resetCommon, setDraftProgramId } from "redux/common/commonSlice";

export default function AllTalents() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  // get enrolled talents -  ENROLLED
  const organizationId = orgId;
  const { data, isFetching, refetch } = useGetOrganizationEnrollmentsQuery(
    organizationId,
    {
      skip: !organizationId,
    },
  );

  const id = orgId;

  // get invited talents - INVITED
  const { data: sentInvites, refetch: getInvites } = useGetSentInvitesQuery(
    id,
    {
      skip: !id,
    },
  );

  useEffect(() => {
    if (isFetching) {
      getInvites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const [showingTalents, setShowingTalents] = useState([]);

  // set correct data to table on switch
  useEffect(() => {
    setShowingTalents(data?.data ?? []);
  }, [data?.data]);

  const [showTalentEnrolModal, setShowTalentEnrolModal] = useState<string[]>(
    [],
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDraftProgramId(undefined));
    dispatch(resetCommon());
  }, [dispatch]);

  return (
    <>
      <Header title={`Enrolled Talents - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[40px] flex h-full items-start justify-start gap-8 pt-4 md:ml-[250px]">
          <div className="h-max w-full rounded-md p-2 lg:w-[90%]">
            <div className="relative w-full md:py-16 md:pt-0">
              <div className="mb-12 w-full">
                <div
                  className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white
  text-tertiary shadow-lg"
                >
                  <div className="mb-0 rounded-t border-0 px-4 py-3">
                    <div className="flex flex-wrap items-center">
                      <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                        <h3 className="text-lg font-semibold text-tertiary">
                          Enrolled talents ({showingTalents?.length || 0})
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="block w-full overflow-x-auto ">
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

                      {isFetching || !orgId ? (
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              colSpan={6}
                              className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
                            >
                              <Spinner smaller />
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {/* enrolled */}
                          {showingTalents?.length === 0 &&
                            data &&
                            sentInvites && (
                              <tr>
                                <td
                                  align="center"
                                  colSpan={6}
                                  className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-lg font-bold"
                                >
                                  No talents have enrolled yet
                                </td>
                              </tr>
                            )}
                          {showingTalents?.length > 0 &&
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            showingTalents?.map((talent: any) => (
                              <tr
                                key={talent?.id}
                                className="border border-secondary/25 hover:bg-secondary/10"
                              >
                                <td className="relative flex flex-col gap-3 whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left text-xs md:flex-row md:items-center md:gap-0">
                                  <img
                                    src={generateAvatar(
                                      talent?.User?.id ?? talent?.id,
                                    )}
                                    className="h-12 w-12 rounded-full border bg-white"
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
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {showTalentEnrolModal?.length > 0 && (
                <SelectPrograms
                  closeModal={(val) => {
                    if (val) {
                      refetch();
                    }
                    setShowTalentEnrolModal([]);
                  }}
                  talentId={showTalentEnrolModal[0] as string}
                  talentName={showTalentEnrolModal[1] as string}
                  programs={[]}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardWrapper>
    </>
  );
}

export function CompletionStatus({
  enrollment,
}: {
  enrollment: {
    userId: string;
  };
}) {
  const talentId = enrollment?.userId;
  const { data, isFetching } = useGetTalentEnrollmentsQuery(talentId, {
    skip: !talentId,
  });

  const checkCompletionStatus = () => {
    if (data?.data?.length === 0) return 0;
    // check all enrollment objects field enrollmentStatus for values pending, completed then return the percentage completed
    const completed = data?.data?.filter(
      (enrollment: OnboardingProgramTalents) =>
        enrollment?.enrollmentStatus === "completed",
    );
    const pending = data?.data?.filter(
      (enrollment: OnboardingProgramTalents) =>
        enrollment?.enrollmentStatus === "pending",
    );
    const total = completed?.length + pending?.length;
    const percentage = (completed?.length / total) * 100;
    return percentage;
  };

  const getSliderColor = (percentage: number) => {
    // 0 - 30 red
    // 31 - 60 orange
    // 61 - 100 green

    if (percentage >= 0 && percentage <= 30) {
      return "bg-red-500";
    }
    if (percentage >= 31 && percentage <= 60) {
      return "bg-yellow-500";
    }
    if (percentage >= 61 && percentage <= 100) {
      return "bg-green-500";
    }
  };

  const getSliderColorBorder = (percentage: number) => {
    // 0 - 30 red
    // 31 - 60 orange
    // 61 - 100 green

    if (percentage >= 0 && percentage <= 30) {
      return "border-black/50";
    }
    if (percentage >= 31 && percentage <= 60) {
      return "border-yellow-500";
    }
    if (percentage >= 61 && percentage <= 100) {
      return "border-green-500";
    }
  };

  return (
    <td className="progress whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
      {isFetching || !data ? (
        <div className="h-[30px] w-4/5 animate-pulse rounded bg-gray-400" />
      ) : (
        <div className="flex items-center">
          <span className="mr-2 w-[50px] text-right font-semibold">
            {checkCompletionStatus().toFixed(0)}%
          </span>
          <div className="relative w-full">
            <div
              className={`flex h-3 overflow-hidden rounded-none border-[1px] border-amber-600 bg-transparent text-xs ${getSliderColorBorder(
                checkCompletionStatus(),
              )}`}
            >
              <motion.div
                style={{ width: `${checkCompletionStatus()}%` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${checkCompletionStatus()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`flex h-3 flex-col justify-center whitespace-nowrap rounded-none text-center text-white ${getSliderColor(
                  checkCompletionStatus(),
                )}`}
              ></motion.div>
            </div>
          </div>
        </div>
      )}
    </td>
  );
}
