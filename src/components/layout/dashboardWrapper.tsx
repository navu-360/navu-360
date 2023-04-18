import React, { useState } from "react";
import AdminNav from "./dashboard.sidebar";
import TopNavAdmin from "./dashboard.topNav";
import InviteTalentsModal from "components/dashboard/inviteTalents";

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
          }}
          invitedEmails={[]}
          enrolledTalents={[]}
        />
      )}
    </main>
  );
}
