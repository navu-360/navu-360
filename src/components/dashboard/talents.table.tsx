/* eslint-disable @next/next/no-img-element */
import Spinner from "components/common/spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllTalentsQuery,
  useGetOrganizationEnrollmentsQuery,
  useGetTalentEnrollmentsQuery,
} from "services/baseApiSlice";
import { generateAvatar } from "utils/avatar";
import { processDate } from "utils/date";

import { useGetSentInvitesQuery } from "services/baseApiSlice";
import { TalentSwitch } from "./common";
import type {
  OnboardingProgram,
  OnboardingProgramTalents,
  Organization,
  User,
  invites,
} from "@prisma/client";
import { SelectPrograms } from "./selectPrograms";
import { AnimatePresence } from "framer-motion";

import { motion } from "framer-motion";
import { NoInvitedTalents } from "./guides";
import InviteTalentsModal from "./inviteTalents";

export default function AllTalents({
  sendTotalTalents,
  setTotalOnboarded,
  onboardingPrograms,
}: {
  sendTotalTalents: (count: number) => void;
  setTotalOnboarded: (count: number) => void;
  onboardingPrograms: OnboardingProgram[];
}) {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );
  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData,
  );

  // get enrolled talents -  ENROLLED
  const organizationId = orgId;
  const { data, isFetching, refetch } = useGetOrganizationEnrollmentsQuery(
    organizationId,
    {
      skip: !organizationId,
    },
  );

  // get all talents in the organization
  const org = orgId;
  const { data: allUsers } = useGetAllTalentsQuery(org, {
    skip: !org,
  });

  const [talentsWithoutPrograms, setTalentsWithoutPrograms] = useState([]);

  // joined but not enrolled - JOINED
  useEffect(() => {
    if (allUsers?.data && data?.data) {
      // get all talents who are not enrolled in any program. comparing allUsers and data
      const talentsWithoutPrograms = allUsers?.data?.filter(
        (talent: User) =>
          !data?.data?.find(
            (enrolledTalent: OnboardingProgramTalents) =>
              enrolledTalent.userId === talent.id,
          ),
      );
      setTalentsWithoutPrograms(talentsWithoutPrograms ?? []);
    }
  }, [allUsers, data?.data]);

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

  useEffect(() => {
    sendTotalTalents(data?.data?.length || 0);
    setTotalOnboarded(
      data?.data?.filter(
        (talent: OnboardingProgramTalents) =>
          talent.enrollmentStatus === "completed",
      ).length || 0,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  const [showingTalents, setShowingTalents] = useState([]);

  const [selectedType, setSelectedType] = useState("Enrolled");

  // set correct data to table on switch
  useEffect(() => {
    selectedType === "Enrolled"
      ? setShowingTalents(data?.data ?? [])
      : selectedType === "Invited"
      ? // filter invites, remove those who are already enrolled, filter by email
        setShowingTalents(
          sentInvites?.data?.filter(
            (invite: invites) =>
              !data?.data?.find(
                (enrolledTalent: { User: { email: string } }) =>
                  enrolledTalent?.User?.email === invite?.email,
              ),
          ) ?? [],
        )
      : setShowingTalents(talentsWithoutPrograms ?? []);
  }, [data?.data, selectedType, sentInvites?.data, talentsWithoutPrograms]);

  useEffect(() => {
    // check: if we have sent invites and no joined talents, set selectedType to Invited
    if (sentInvites?.data?.length > 0 && data?.data?.length === 0) {
      setSelectedType("Invited");
    }
    // check: if we have joined talents and no enrolled talents, set selectedType to Joined
    if (data?.data?.length > 0 && talentsWithoutPrograms.length === 0) {
      setSelectedType("Joined");
    }
  }, [sentInvites?.data, data?.data, talentsWithoutPrograms]);

  const [showTalentEnrolModal, setShowTalentEnrolModal] = useState<string[]>(
    [],
  );

  const [showInviteModal, setShowInviteModal] = useState(false);

  if (isFetching || !orgId)
    return (
      <section className="w-full rounded-l p-2 lg:w-full">
        <section className="relative md:py-16">
          <TalentSwitch
            selectedOption={selectedType}
            setSelectedOption={setSelectedType}
          />
          <div className="mb-12 w-full">
            <div
              className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white
  text-tertiary shadow-lg"
            >
              <div className="mb-0 rounded-t border-0 px-4 py-3">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                    <h3 className="text-lg font-semibold text-tertiary">
                      {selectedType} Talents
                    </h3>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto ">
                <table className="w-full border-collapse items-center bg-transparent">
                  <thead>
                    {selectedType !== "Invited" ? (
                      <tr>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Talent
                        </th>
                        <th className="role whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Role
                        </th>
                        <th className="date whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          {selectedType === "Enrolled" ? "Enrolled" : "Joined"}
                        </th>
                        {selectedType === "Enrolled" && (
                          <th className="progress whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                            Completion{" "}
                          </th>
                        )}
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Action
                        </th>
                      </tr>
                    ) : (
                      <tr className="invite">
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Talent
                        </th>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Invite Date
                        </th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        align="center"
                        colSpan={selectedType !== "Invited" ? 6 : 4}
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
    <section
      className={`h-max min-h-[60vh] w-full rounded-l lg:w-full ${
        data?.data?.length === 0 && sentInvites?.data?.length === 0
          ? "flex justify-center"
          : ""
      }`}
    >
      {data?.data?.length === 0 && sentInvites?.data?.length === 0 && (
        <NoInvitedTalents
          coursesCount={onboardingPrograms.length}
          orgName={organizationData?.name as string}
          showInviteModal={() => setShowInviteModal(true)}
        />
      )}
      {!(data?.data?.length === 0 && sentInvites?.data?.length === 0) && (
        <section className="relative w-full md:py-16">
          <TalentSwitch
            selectedOption={selectedType}
            setSelectedOption={setSelectedType}
          />
          <div className="mb-12 w-full">
            <div
              className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white
  text-tertiary shadow-lg"
            >
              <div className="mb-0 rounded-t border-0 px-4 py-3">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                    <h3 className="text-lg font-semibold text-tertiary">
                      {selectedType} Talents ({showingTalents?.length || 0})
                    </h3>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto ">
                <table className="w-full max-w-[100%] border-collapse items-center overflow-x-auto bg-transparent">
                  <thead>
                    {selectedType !== "Invited" ? (
                      <tr>
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Talent
                        </th>
                        <th className="role whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Role
                        </th>
                        <th className="date whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          {selectedType === "Enrolled" ? "Enrolled" : "Joined"}
                        </th>
                        {selectedType === "Enrolled" && (
                          <th className="progress whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                            Completion{" "}
                          </th>
                        )}
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Action
                        </th>
                      </tr>
                    ) : (
                      <tr className="invite">
                        <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Email
                        </th>
                        <th className="invite-date whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                          Invite Date
                        </th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    {/* enrolled */}
                    {showingTalents?.length === 0 && data && sentInvites && (
                      <tr>
                        <td
                          align="center"
                          colSpan={selectedType !== "Invited" ? 6 : 4}
                          className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-lg font-bold"
                        >
                          No talents have{" "}
                          {selectedType !== "Joined" ? "been" : ""}{" "}
                          {selectedType.toLowerCase()} yet
                        </td>
                      </tr>
                    )}
                    {showingTalents?.length > 0 &&
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      showingTalents?.map((talent: any) =>
                        selectedType !== "Invited" ? (
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
                            {selectedType === "Enrolled" && (
                              <CompletionStatus enrollment={talent} />
                            )}
                            <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs">
                              <div
                                className="min-w-48 z-50 list-none rounded py-2 text-left text-base"
                                id="table-dark-1-dropdown"
                              >
                                {selectedType === "Enrolled" ? (
                                  <Link
                                    href={`/talents/${talent?.User?.id}`}
                                    className="text-blueGray-700 mb-2 block w-max rounded-xl border-[1px] border-secondary/50 bg-white px-4 py-2 text-sm font-semibold text-secondary transition-all duration-150 ease-in hover:bg-secondary hover:text-white md:px-12"
                                  >
                                    View
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setShowTalentEnrolModal([
                                        talent?.id,
                                        talent?.name as string,
                                      ])
                                    }
                                    className="text-blueGray-700 mb-2 block w-max rounded-xl border-[1px] border-secondary/50 bg-white px-4 py-2 text-sm font-semibold text-secondary transition-all duration-150 ease-in hover:bg-secondary hover:text-white md:px-12"
                                  >
                                    Enroll Now
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr
                            className="invite border border-secondary/25 hover:bg-secondary/10"
                            key={talent?.id}
                          >
                            <th className="flex flex-col gap-2 whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 text-left text-xs lg:flex-row lg:items-center lg:gap-0 lg:px-6 lg:align-middle">
                              <img
                                src={generateAvatar(talent?.id)}
                                className="ml-4 h-12 w-12 rounded-full border bg-white lg:ml-0"
                                alt={talent?.email as string}
                              />
                              <span className="ml-3 font-bold">
                                {talent?.email}
                              </span>
                            </th>

                            <td className="invite-date whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs font-semibold">
                              {processDate(talent?.createdAt)}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
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
            programs={onboardingPrograms}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInviteModal && (
          <InviteTalentsModal
            closeModal={() => {
              setShowInviteModal(false);
            }}
            invitedEmails={
              sentInvites?.data
                ? sentInvites?.data?.map((inv: invites) => inv?.email)
                : []
            }
          />
        )}
      </AnimatePresence>
    </section>
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
