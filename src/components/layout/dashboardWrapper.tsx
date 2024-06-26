import React, { useState } from "react";
import AdminNav from "./dashboard.sidebar";
import TopNavAdmin from "./dashboard.topNav";
import InviteTalentsModal from "components/dashboard/inviteTalents";
import { useGetSentInvitesQuery } from "services/baseApiSlice";
import { useSelector } from "react-redux";
import type { invites } from "@prisma/client";

import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

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

  const { data: session } = useSession();

  const id = orgId;


  const { data: sentInvites } = useGetSentInvitesQuery(id, {
    skip: !id || session?.user?.role === "talent",
  });

  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col overflow-x-hidden gap-0 ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <AdminNav showInviteTalent={() => setShowModal(true)} />}

      <TopNavAdmin hideSearch={hideSearch} />

      {children}

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
