import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React from "react";

export default function Dashboard() {
  return (
    <>
      <Header />
      <DashboardWrapper>
        <h1>Welcome</h1>
      </DashboardWrapper>
    </>
  );
}
