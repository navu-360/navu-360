import React, { useState } from "react";
import AdminNav from "./dashboard.sidebar";
import TopNavAdmin from "./dashboard.topNav";
import InviteTalentsModal from "components/dashboard/inviteTalents";
import { useGetSentInvitesQuery } from "services/baseApiSlice";
import { useSelector } from "react-redux";
import type { invites } from "@prisma/client";

import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { GetPlan } from "components/dashboard/guides";

export default function DashboardWrapper({
  children,
  hideNav,
  hideSearch,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
  hideSearch?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  const { data: session, status } = useSession();

  const id = orgId;

  const { data: sentInvites } = useGetSentInvitesQuery(id, {
    skip: !id || session?.user?.role === "talent",
  });

  console.log("session?.user?.role", session?.user);

  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col gap-0 ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <AdminNav showInviteTalent={() => setShowModal(true)} />}
      <TopNavAdmin hideSearch={hideSearch} />
      {status === "loading" || session?.user?.role === "talent" ? (
        children
      ) : session?.user?.customerId ? (
        children
      ) : (
        <GetPlan />
      )}
      <AnimatePresence>
        {showModal && (
          <InviteTalentsModal
            closeModal={() => {
              setShowModal(false);
            }}
            invitedEmails={
              sentInvites?.data
                ? sentInvites?.data?.map((inv: invites) => inv?.email)
                : []
            }
          />
        )}
      </AnimatePresence>
    </main>
  );
}
