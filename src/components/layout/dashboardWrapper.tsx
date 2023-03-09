import React from "react";
import AdminNav from "./adminNav";
import TopNavAdmin from "./topNav";

export default function DashboardWrapper({
  children,
  hideNav,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
}) {
  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col gap-0 ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <AdminNav />}
      <TopNavAdmin />
      {children}
    </main>
  );
}
