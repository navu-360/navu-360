/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Spinner from "components/common/spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetOrganizationEnrollmentsQuery } from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

import DashboardWrapper from "components/layout/dashboardWrapper";

import { useGetSentInvitesQuery } from "services/baseApiSlice";
import type { OnboardingProgramTalents, User } from "@prisma/client";
import { AnimatePresence } from "framer-motion";

import { SelectPrograms } from "components/dashboard/selectPrograms";
import Header from "components/common/head";
import { resetCommon, setDraftProgramId } from "redux/common/commonSlice";
import SearchResults from "components/common/searchResults";
import { CompletionStatus } from "components/dashboard/talents.table";

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
      refetchOnMountOrArgChange: true,
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

  const [showingTalents, setShowingTalents] = useState<User[]>([]);

  // set correct data to table on switch
  useEffect(() => {
    if (data?.data) {
      setShowingTalents(getEnrolledTalentsFromEnrollments());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  const getEnrolledTalentsFromEnrollments = () => {
    // from data?.data, we get all data?.data[0]?.user where it an object for user, has field id. From all enrollments, get the users then remove duplicates
    const enrolledTalents = data?.data?.map(
      (
        enrollment: OnboardingProgramTalents & {
          User: User;
        },
      ) => enrollment?.User,
    );
    const uniqueEnrolledTalents = Array.from(
      new Set(enrolledTalents?.map((a: User) => a?.id)),
    ).map((id) => {
      return enrolledTalents?.find((a: User) => a?.id === id);
    });
    return uniqueEnrolledTalents;
  };

  const [showTalentEnrolModal, setShowTalentEnrolModal] = useState<string[]>(
    [],
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDraftProgramId(undefined));
    dispatch(resetCommon());
  }, [dispatch]);

  const searchQuery = useSelector((state: any) => state.common.searchQuery);

  return (
    <>
      <Header title={`Enrolled Talents - Navu360`} />
      <DashboardWrapper>
        {searchQuery?.length > 0 ? (
          <SearchResults />
        ) : (
          <div className="relative ml-[90px] mt-[40px] flex h-full items-start justify-start gap-8 pt-0 md:ml-[250px]">
            <div className="h-max w-full rounded-md lg:w-[90%]">
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
                              Courses Enrolled
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
                                colSpan={5}
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
                                      src={generateAvatar(talent?.name)}
                                      className="h-12 w-12 rounded-full"
                                      alt={talent?.name}
                                    />
                                    <span className="ml-3 font-bold capitalize">
                                      {talent?.name}
                                    </span>
                                    <span className="ml-3 font-bold capitalize">
                                      {talent?.email}
                                    </span>
                                  </td>
                                  <td className="role whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                                    {data?.data?.filter(
                                      (enrollment: OnboardingProgramTalents) =>
                                        enrollment?.userId === talent?.id,
                                    )?.length ?? 0}{" "}
                                    Courses
                                  </td>
                                  <td className="date whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                                    {processDate(talent?.createdAt)}
                                  </td>
                                  <CompletionStatus
                                    enrollment={{
                                      userId: talent?.id,
                                    }}
                                  />

                                  <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs">
                                    <div
                                      className="min-w-48 z-50 list-none rounded py-2 text-left text-base"
                                      id="table-dark-1-dropdown"
                                    >
                                      <Link
                                        href={`/talents/${talent?.id}`}
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
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </DashboardWrapper>
    </>
  );
}
