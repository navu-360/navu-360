import React, { useState } from "react";
import AdminNav from "./dashboard.sidebar";
import TopNavAdmin from "./dashboard.topNav";
import InviteTalentsModal from "components/dashboard/inviteTalents";
import { useGetSentInvitesQuery } from "services/baseApiSlice";
import { useSelector } from "react-redux";
import { invites } from "@prisma/client";

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
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const id = orgId;
  
  const {data:sentInvites, refetch} = useGetSentInvitesQuery(id, {
    skip: !id
  })
  
  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col gap-0 ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <AdminNav showInviteTalent={() => setShowModal(true)} />}
      <TopNavAdmin hideSearch={hideSearch} />
      {children}

      {showModal && (
        <InviteTalentsModal
          closeModal={() => {
            setShowModal(false);
            refetch();
          }}
          invitedEmails={sentInvites?.data ?  sentInvites?.data?.map((inv:invites) => inv?.email) : []}
        />
      )}
    </main>
  );
}
